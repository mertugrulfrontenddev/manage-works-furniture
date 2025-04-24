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
import LoadingSpinner from "./LoadingSpinner";
const Drilling = () => {
  const { products } = useContext(LotContext);
  const [productsWithLots, setProductsWithLots] = useState([]);
  const [startTimes, setStartTimes] = useState({});
  const [endTimes, setEndTimes] = useState({});
  const [drillingFilter, setDrillingFilter] = useState("");
  const [Loading, setLoading] = useState(true);
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
      operationKey: lotNumber + "-" + partId + "-delme",
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
    try {
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

      // Kontrol: Eğer 'lots' undefined veya boşsa, işlemi durdur
      if (!lots || lots.length === 0) {
        console.log("No lots found.");
        return;
      }

      // 3. Ürünleri işle
      const lotsWithPartAndOp = await Promise.all(
        lots.map(async (lot) => {
          // 4. Ürünlere ait lotları eşleştir

          // 5. Parçaları çek
          const partsCollection = collection(
            db,
            `products/${lot.productCode}/parts`
          );

          const q = query(
            partsCollection,
            where("drilling", "!=", "Delik Yok")
          );
          const partSnapshot = await getDocs(q);
          const partsList = partSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Kontrol: Eğer 'partsList' undefined veya boşsa, işlemi durdur
          if (!partsList || partsList.length === 0) {
            console.log(`No parts found for lot ${lot.lotNumber}`);
            return { ...lot, parts: [] }; // Boş bir parts array döndür
          }

          // 6. Her lotu, her parça ile eşleştir ve operationsData ile karşılaştır
          const partsWithLot = partsList
            .filter((part) => {
              const matchedOperations = operationsData.filter(
                (operation) =>
                  operation.lotNumber === lot.lotNumber &&
                  operation.partId === part.id
              );

              const bandingSkipped =
                part.banding === "E Kenar" || part.banding === "Bantlama Yok";

              return matchedOperations.length > 0 || bandingSkipped;
            })

            .map((part) => ({
              ...part,
              lotNumber: lot.lotNumber,
              startTime: part.startTime || "", // Firestore'dan gelen zaman
              endTime: part.endTime || "", // Firestore'dan gelen zaman
            }));

          return { ...lot, parts: partsWithLot };
        })
      );

      const sortedLots = lotsWithPartAndOp.sort((a, b) => {
        if (a.lotNumber < b.lotNumber) return -1;
        if (a.lotNumber > b.lotNumber) return 1;
        return 0;
      });

      setProductsWithLots(sortedLots);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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

      {Loading ? (
        <LoadingSpinner />
      ) : (
        <>
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
                  <th>Bantlama</th>
                  <th>Delme</th>
                  <th>Başlama Zamanı</th>
                  <th>Bitiş Zamanı</th>
                </tr>
              </thead>
              <tbody>
                {productsWithLots.map((lot, lotIndex) =>
                  lot.parts
                    .filter((part) => {
                      const matchesDrilling = drillingFilter
                        ? part.drilling === drillingFilter
                        : true;

                      return matchesDrilling;
                    })
                    .map((part, partIndex) => {
                      const isComplete =
                        operations[`${lot.lotNumber}-${part.id}-delme`]
                          ?.delmeEnd;
                      return (
                        !isComplete && (
                          <tr
                            key={`${lot.productCode}-${lotIndex}-${partIndex}`}
                          >
                            <td>{lot.lotNumber || "No Value"}</td>
                            <td>{lot.productName}</td>
                            <td>{lot.productCode}</td>
                            <td>{part.partName || "No Value"}</td>
                            <td>{part.paketNo || "No Value"}</td>
                            <td>{part.cinsi || "No Value"}</td>
                            <td>{part.materialColor || "No Value"}</td>
                            <td>{part.thickness || "No Value"}</td>
                            <td>{part.unitCount || "No Value"}</td>
                            <td>
                              {part.unitCount * lot.quantity || "No Value"}
                            </td>
                            <td>{part.pvcColor || "No Value"}</td>
                            <td>{part.banding || "No Value"}</td>
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
                                required
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
                                  endTimes[
                                    `${lot.lotNumber}-${part.id}-delme`
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
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Drilling;
