import { useEffect, useState, useContext } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  setDoc,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { LotContext } from "../context/LotContext";
import "bootstrap/dist/css/bootstrap.min.css";

const Banding = () => {
  const { products } = useContext(LotContext);
  const [productsWithLots, setProductsWithLots] = useState([]);
  const [startTimes, setStartTimes] = useState({});
  const [endTimes, setEndTimes] = useState({});
  const [bandingFilter, setBandingFilter] = useState(""); // Add filter state for banding
  const [operations, setOperations] = useState({});
  const handleTimeChange = (lotNumber, partId, type, value) => {
    if (type === "start") {
      setStartTimes((prev) => ({
        ...prev,
        [`${lotNumber}-${partId}-banding`]: value,
      }));
    } else {
      setEndTimes((prev) => ({
        ...prev,
        [`${lotNumber}-${partId}-banding`]: value,
      }));
    }
  };

  // Fetch saved times for 'banding' and 'delme' operations
  const fetchSavedTimes = async () => {
    const operationQuery = query(
      collection(db, "operations"),
      where("type", "in", ["banding", "delme"]) // Fetch both banding and delme operations
    );
    const operationSnapshot = await getDocs(operationQuery);
    const operationData = operationSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const savedStartTimes = {};
    const savedEndTimes = {};

    operationData.forEach((operation) => {
      const { lotNumber, partId, startTime, endTime, type } = operation;
      const key = `${lotNumber}-${partId}-${type}`;

      if (type === "banding") {
        savedStartTimes[key] = startTime;
        savedEndTimes[key] = endTime;
      }
      if (type === "delme") {
        savedStartTimes[`${key}-delme`] = startTime;
        savedEndTimes[`${key}-delme`] = endTime;
      }
    });

    setStartTimes(savedStartTimes);
    setEndTimes(savedEndTimes);
  };

  // Update start time for banding operation
  const updatePartStartTime = async (lotNumber, partId, type) => {
    const startTime = startTimes[`${lotNumber}-${partId}-${type}`] || "";
    if (!startTime) return;

    const operationRef = doc(
      db,
      "operations",
      `${lotNumber}-${partId}-${type}`
    );

    await setDoc(operationRef, {
      lotNumber,
      partId,
      startTime,
      type,
      bandingEnd: false, // type is "banding" here
      operationKey: lotNumber + "-" + partId + "-banding",
      timestamp: new Date(),
    });
  };

  // Update end time for banding operation
  const updatePartEndTime = async (lotNumber, partId, type) => {
    const endTime = endTimes[`${lotNumber}-${partId}-${type}`] || "";
    const startTime = startTimes[`${lotNumber}-${partId}-${type}`] || "";

    if (!endTime) return;
    if (new Date(endTime) < new Date(startTime)) {
      alert("Bitiş zamanı başlama zamanından önce olamaz!");
      return;
    }

    const operationRef = doc(
      db,
      "operations",
      `${lotNumber}-${partId}-${type}`
    );

    await updateDoc(operationRef, {
      endTime,
      timestamp: new Date(),
      bandingEnd: true,
    });
  };

  // Fetch products and lots from Firestore
  const fetchLotAndProducts = async () => {
    // 1. "cutting_operations" koleksiyonundaki verileri sorgulama
    const cuttingOperationsQuery = query(
      collection(db, "cutting_operations"),
      where("ebatlamaTamamlandi", "==", true)
    );
    const cuttingOperationsSnapshot = await getDocs(cuttingOperationsQuery);
    const cuttingOperations = cuttingOperationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 2. "lots" koleksiyonundaki verileri sorgulama
    const lotQuery = query(
      collection(db, "lots"),
      where("status", "==", "Üretimde")
    );
    const lotSnapshot = await getDocs(lotQuery);
    const lots = lotSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 3. Ürünleri işle
    const productList = await Promise.all(
      products.map(async (product) => {
        // 4. Ürünlere ait lotları eşleştir
        const matchedLots = lots.filter(
          (lot) => lot.productCode === product.code
        );

        // 5. Parçaları çek
        const partsCollection = collection(
          db,
          `products/${product.code}/parts`
        );
        const partSnapshot = await getDocs(partsCollection);
        const partsList = partSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 6. Her lotu, her parça ile eşleştir ve "materialColor" ile karşılaştır
        const lotsWithParts = matchedLots.map((lot) => {
          const partsWithLot = partsList
            .filter((part) => {
              // cutting_operations koleksiyonundaki ilgili lot'ları ve plakaTanim'leri bul
              const matchedOperations = cuttingOperations.filter(
                (operation) => operation.lotNumber === lot.lotNumber
              );

              // Eğer eşleşen birden fazla operation varsa, bunlardan en az birinin plakaTanim'inin parça ile eşleşmesi gerek
              return matchedOperations.some(
                (operation) => part.materialColor === operation.plakaTanim
              );
            })
            .map((part) => ({
              ...part,
              lotNumber: lot.lotNumber,
              startTime: part.startTime || "", // Firestore'dan gelen zaman
              endTime: part.endTime || "", // Firestore'dan gelen zaman
            }));

          return { ...lot, parts: partsWithLot };
        });

        return { ...product, lots: lotsWithParts };
      })
    );
    const sortedProductList = productList.map((product) => ({
      ...product,
      lots: product.lots.sort((a, b) => {
        // Eğer lotNumber bir string ise, sayıya dönüştür ve karşılaştır
        const lotNumberA =
          typeof a.lotNumber === "string"
            ? parseFloat(a.lotNumber)
            : a.lotNumber;
        const lotNumberB =
          typeof b.lotNumber === "string"
            ? parseFloat(b.lotNumber)
            : b.lotNumber;

        return lotNumberA - lotNumberB; // Sayısal sıralama
      }),
    }));

    setProductsWithLots(sortedProductList);
  };

  useEffect(() => {
    fetchLotAndProducts();
    fetchSavedTimes(); // Fetch saved times on component mount
  }, [products]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "operations"),
      (querySnapshot) => {
        const operations = {};
        querySnapshot.forEach((doc) => {
          operations[doc.id] = doc.data();
        });
        setOperations(operations); // Veriyi güncelle
      }
    );

    // Unsubscribe (temizleme) işlemi
    return () => unsubscribe();
  }, []);
  return (
    <div className="container mt-4">
      <h3 className="bg-primary text-white p-2 fw-light">
        Ürünler ve Parçalar (Bantlama)
      </h3>

      {/* Filter for banding type */}
      <div className="mb-3">
        <label htmlFor="bandingFilter">Bantlama Türü</label>
        <select
          id="bandingFilter"
          className="form-control"
          onChange={(e) => setBandingFilter(e.target.value)}
        >
          <option value="">Seçiniz</option>
          <option value="K Bandlama">K Bandlama</option>
          <option value="B Bandlama">B Bandlama</option>
          <option value="E Kenar">E Kenar</option>
        </select>
      </div>

      <div className="table-responsive">
        <table className="table table-sm" style={{ fontSize: "12px" }}>
          <thead>
            <tr>
              <th>Lot No</th>
              <th>Ürün Adı</th>
              <th>Ürün Kodu</th>
              <th>Parça Adı</th>
              <th>Paket No</th>
              <th>Cinsi</th>
              <th>Malzeme Rengi</th>
              <th>Kalınlık</th>
              <th>Birim Adet</th>
              <th>Toplam Adet</th>
              <th>PVC Rengi</th>
              <th>Bantlama</th>
              <th>Başlama Zamanı</th>
              <th>Bitiş Zamanı</th>
            </tr>
          </thead>
          <tbody>
            {productsWithLots.map((product) =>
              product.lots.map((lot, lotIndex) =>
                lot.parts
                  .filter((part) =>
                    bandingFilter ? part.banding === bandingFilter : true
                  ) // Apply the filter for banding
                  .map((part, partIndex) => {
                    const isComplete =
                      operations[`${lot.lotNumber}-${part.id}-banding`]
                        ?.bandingEnd;
                    return (
                      !isComplete && (
                        <tr key={`${product.code}-${lotIndex}-${partIndex}`}>
                          <td>
                            {lot.lotNumber || "No Value"} {}
                          </td>
                          <td>
                            {partIndex === 0 ? product.name || "No Value" : ""}
                          </td>
                          <td>
                            {partIndex === 0 ? product.code || "No Value" : ""}
                          </td>
                          <td>{part.partName || "No Value"} </td>
                          <td>{part.paketNo || "No Value"}</td>
                          <td>{part.cinsi || "No Value"}</td>
                          <td>{part.materialColor || "No Value"}</td>
                          <td>{part.thickness || "No Value"}</td>
                          <td>{part.unitCount || "No Value"}</td>
                          <td>{part.totalCount || "No Value"}</td>
                          <td>{part.pvcColor || "No Value"}</td>
                          <td>{part.banding || "No Value"}</td>
                          <td>
                            <input
                              type="datetime-local"
                              value={
                                startTimes[
                                  `${lot.lotNumber}-${part.id}-banding`
                                ] || ""
                              }
                              onChange={(e) =>
                                handleTimeChange(
                                  lot.lotNumber,
                                  part.id,
                                  "start",
                                  e.target.value
                                )
                              }
                            />
                            <button
                              className="btn btn-primary btn-sm mt-1"
                              onClick={() =>
                                updatePartStartTime(
                                  lot.lotNumber,
                                  part.id,
                                  "banding"
                                )
                              }
                            >
                              Başlama Ekle
                            </button>
                          </td>
                          <td>
                            <input
                              type="datetime-local"
                              value={
                                endTimes[
                                  `${lot.lotNumber}-${part.id}-banding`
                                ] || ""
                              }
                              onChange={(e) =>
                                handleTimeChange(
                                  lot.lotNumber,
                                  part.id,
                                  "end",
                                  e.target.value
                                )
                              }
                            />
                            <button
                              className="btn btn-danger btn-sm mt-1"
                              onClick={() =>
                                updatePartEndTime(
                                  lot.lotNumber,
                                  part.id,
                                  "banding"
                                )
                              }
                            >
                              Bitiş Ekle
                            </button>
                          </td>
                          <td></td>
                        </tr>
                      )
                    );
                  })
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Banding;
