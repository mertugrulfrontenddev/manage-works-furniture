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

const Drilling = () => {
  const { products } = useContext(LotContext);
  const [productsWithLots, setProductsWithLots] = useState([]);
  const [startTimes, setStartTimes] = useState({});
  const [endTimes, setEndTimes] = useState({});
  const [drillingFilter, setDrillingFilter] = useState("");

  const [operations, setOperations] = useState({});

  const handleTimeChange = (lotNumber, partId, type, value) => {
    const key = `${lotNumber}-${partId}-delme`;
    if (type === "start") {
      setStartTimes((prev) => ({ ...prev, [key]: value }));
    } else {
      setEndTimes((prev) => ({ ...prev, [key]: value }));
    }
  };

  const fetchSavedTimes = async () => {
    const operationQuery = query(
      collection(db, "operations"),
      where("type", "==", "delme")
    );
    const operationSnapshot = await getDocs(operationQuery);
    const operationData = operationSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const savedStartTimes = {};
    const savedEndTimes = {};

    operationData.forEach((operation) => {
      const { lotNumber, partId, startTime, endTime } = operation;
      savedStartTimes[`${lotNumber}-${partId}-delme`] = startTime;
      savedEndTimes[`${lotNumber}-${partId}-delme`] = endTime;
    });

    setStartTimes(savedStartTimes);
    setEndTimes(savedEndTimes);
  };

  const updatePartStartTime = async (lotNumber, partId) => {
    const startTime = startTimes[`${lotNumber}-${partId}-delme`] || "";
    if (!startTime) return;

    const operationRef = doc(db, "operations", `${lotNumber}-${partId}-delme`);
    await setDoc(operationRef, {
      lotNumber,
      partId,
      startTime,
      delmeEnd: false,
      type: "delme",
      timestamp: new Date(),
    });
  };

  const updatePartEndTime = async (lotNumber, partId) => {
    const endTime = endTimes[`${lotNumber}-${partId}-delme`] || "";
    const startTime = startTimes[`${lotNumber}-${partId}-delme`] || "";

    if (!endTime) return;
    if (new Date(endTime) < new Date(startTime)) {
      alert("Bitiş zamanı başlama zamanından önce olamaz!");
      return;
    }

    const operationRef = doc(db, "operations", `${lotNumber}-${partId}-delme`);
    await updateDoc(operationRef, {
      endTime,
      timestamp: new Date(),
      delmeEnd: true,
    });
  };

  const fetchLotAndProducts = async () => {
    // 1. "operations" koleksiyonundaki "type" değeri "banding" ve "bandingEnd" değeri true olan verileri sorgulama
    const operationsQuery = query(
      collection(db, "operations"),
      where("type", "==", "banding"),
      where("bandingEnd", "==", true)
    );
    const operationsSnapshot = await getDocs(operationsQuery);
    const operationsData = operationsSnapshot.docs.map((doc) => ({
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

        // 6. Her lotu, her parça ile eşleştir ve operationsData ile karşılaştır
        const lotsWithParts = matchedLots.map((lot) => {
          const partsWithLot = partsList
            .filter((part) => {
              // operations koleksiyonundaki ilgili lotNumber ve partId'leri bul
              const matchedOperations = operationsData.filter(
                (operation) =>
                  operation.lotNumber === lot.lotNumber &&
                  operation.partId === part.id
              );

              // Eğer eşleşen operation varsa, işlemi dahil et
              return matchedOperations.length > 0;
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
        if (
          typeof a.lotNumber === "string" &&
          typeof b.lotNumber === "string"
        ) {
          return a.lotNumber.localeCompare(b.lotNumber); // Eğer string ise
        }
        return a.lotNumber - b.lotNumber; // Eğer number ise
      }),
    }));

    setProductsWithLots(sortedProductList);
  };

  useEffect(() => {
    fetchLotAndProducts();
    fetchSavedTimes();
  }, [products]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "operations"),
      (querySnaphot) => {
        const operations = {};

        querySnaphot.forEach((doc) => {
          operations[doc.id] = doc.data();
        });

        setOperations(operations);
      }
    );
    // Unsubscribe (temizleme) işlemi
    return () => unsubscribe();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="bg-primary text-white p-2 fw-light">
        Ürünler ve Parçalar (Delme)
      </h3>
      {/* Filter for drilling type */}
      <div className="mb-3">
        <label htmlFor="drillingFilter">Delme Türü</label>
        <select
          id="drillingFilter"
          className="form-control"
          onChange={(e) => setDrillingFilter(e.target.value)}
        >
          <option value="">Seçiniz</option>
          <option value="7kafa">7kafa</option>
          <option value="Nanxing 1">Nanxing 1</option>
          <option value="Nanxing 2">Nanxing 2</option>
          <option value="Uniteam">Uniteam</option>
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
              <th>PVC Color</th>
              <th>Delme</th>
              <th>Başlama Zamanı</th>
              <th>Bitiş Zamanı</th>
            </tr>
          </thead>
          <tbody>
            {productsWithLots.map((product) =>
              product.lots.map((lot, lotIndex) =>
                lot.parts
                  .filter((part) =>
                    drillingFilter ? part.drilling === drillingFilter : true
                  ) // Apply the filter here
                  .map((part, partIndex) => {
                    const isComplete =
                      operations[`${lot.lotNumber}-${part.id}-delme`]?.delmeEnd;
                    return (
                      !isComplete && (
                        <tr key={`${product.code}-${lotIndex}-${partIndex}`}>
                          <td>{lot.lotNumber || "No Value"}</td>
                          <td>
                            {partIndex === 0 ? product.name || "No Value" : ""}
                          </td>
                          <td>
                            {partIndex === 0 ? product.code || "No Value" : ""}
                          </td>
                          <td>{part.partName || "No Value"}</td>
                          <td>{part.paketNo || "No Value"}</td>
                          <td>{part.cinsi || "No Value"}</td>
                          <td>{part.materialColor || "No Value"}</td>
                          <td>{part.thickness || "No Value"}</td>
                          <td>{part.unitCount || "No Value"}</td>
                          <td>{part.unitCount * lot.quantity || "No Value"}</td>
                          <td>{part.pvcColor || "No Value"}</td>
                          <td>{part.drilling || "No Value"}</td>
                          <td>
                            <input
                              type="datetime-local"
                              value={
                                startTimes[
                                  `${lot.lotNumber}-${part.id}-delme`
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
                                updatePartStartTime(lot.lotNumber, part.id)
                              }
                            >
                              Başlama Kaydet
                            </button>
                          </td>
                          <td>
                            <input
                              type="datetime-local"
                              value={
                                endTimes[`${lot.lotNumber}-${part.id}-delme`] ||
                                ""
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
                                updatePartEndTime(lot.lotNumber, part.id)
                              }
                            >
                              Bitiş Kaydet
                            </button>
                          </td>
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

export default Drilling;
