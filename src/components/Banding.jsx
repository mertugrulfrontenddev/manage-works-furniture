import { useEffect, useState, useContext } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { LotContext } from "../context/LotContext";
import "bootstrap/dist/css/bootstrap.min.css";

const Banding = () => {
  const { products } = useContext(LotContext);
  const [productsWithLots, setProductsWithLots] = useState([]);
  const [startTimes, setStartTimes] = useState({});
  const [endTimes, setEndTimes] = useState({});
  const [bandingFilter, setBandingFilter] = useState(""); // Add filter state

  const handleTimeChange = (lotNumber, partId, type, value) => {
    if (type === "start") {
      setStartTimes((prev) => ({ ...prev, [`${lotNumber}-${partId}`]: value }));
    } else {
      setEndTimes((prev) => ({ ...prev, [`${lotNumber}-${partId}`]: value }));
    }
  };

  // Fetch saved start and end times from Firestore
  const fetchSavedTimes = async () => {
    const operationQuery = query(collection(db, "operations"));
    const operationSnapshot = await getDocs(operationQuery);
    const operationData = operationSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const savedStartTimes = {};
    const savedEndTimes = {};

    operationData.forEach((operation) => {
      const { lotNumber, partId, startTime, endTime } = operation;
      savedStartTimes[`${lotNumber}-${partId}`] = startTime;
      savedEndTimes[`${lotNumber}-${partId}`] = endTime;
    });

    setStartTimes(savedStartTimes);
    setEndTimes(savedEndTimes);
  };

  // Update start time in Firestore
  const updatePartStartTime = async (lotNumber, partId) => {
    const startTime = startTimes[`${lotNumber}-${partId}`] || "";
    if (!startTime) return;

    const operationRef = doc(db, "operations", `${lotNumber}-${partId}`);

    // If document doesn't exist, create a new document with start time
    await setDoc(operationRef, {
      lotNumber,
      partId,
      startTime,
      type: "banding",
      timestamp: new Date(),
    });
  };

  // Update end time in Firestore
  const updatePartEndTime = async (lotNumber, partId) => {
    const endTime = endTimes[`${lotNumber}-${partId}`] || "";
    const startTime = startTimes[`${lotNumber}-${partId}`] || "";

    // If end time is empty or end time is before start time, show an error
    if (!endTime) return;
    if (new Date(endTime) < new Date(startTime)) {
      alert("Bitiş zamanı başlama zamanından önce olamaz!");
      return;
    }

    const operationRef = doc(db, "operations", `${lotNumber}-${partId}`);

    // Update the existing document with the end time
    await updateDoc(operationRef, {
      endTime,
      timestamp: new Date(),
    });
  };

  const fetchLotAndProducts = async () => {
    const lotQuery = query(
      collection(db, "lots"),
      where("status", "==", "Üretimde")
    );
    const lotSnapshot = await getDocs(lotQuery);
    const lots = lotSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const productList = await Promise.all(
      products.map(async (product) => {
        const matchedLots = lots.filter(
          (lot) => lot.productCode === product.code
        );

        const partsCollection = collection(
          db,
          `products/${product.code}/parts`
        );
        const partSnapshot = await getDocs(partsCollection);
        const partsList = partSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const lotsWithParts = matchedLots.map((lot) => {
          const partsWithLot = partsList.map((part) => {
            return {
              ...part,
              lotNumber: lot.lotNumber,
              startTime: part.startTime || "", // Firestore'dan gelen zaman
              endTime: part.endTime || "", // Firestore'dan gelen zaman
            };
          });
          return { ...lot, parts: partsWithLot };
        });

        return { ...product, lots: lotsWithParts };
      })
    );

    setProductsWithLots(productList);
  };

  useEffect(() => {
    fetchLotAndProducts();
    fetchSavedTimes(); // Fetch the saved times on component mount
  }, [products]);

  return (
    <div className="container mt-4">
      <h3 style={{ fontSize: "18px" }}>Ürünler ve Parçalar</h3>

      {/* Filter for banding type */}
      <div className="mb-3">
        <label htmlFor="bandingFilter">Bantlama Türü</label>
        <select
          id="bandingFilter"
          className="form-control"
          onChange={(e) => setBandingFilter(e.target.value)}
        >
          <option value="">Tümü</option>
          <option value="K Bandlama">K Bandlama</option>
          <option value="B Bandlama">B Bandlama</option>
          <option value="E Kenar">E Kenar</option>
          {/* Add more banding types as needed */}
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
              <th>Material Color</th>
              <th>Thickness</th>
              <th>Unit Count</th>
              <th>Total Count</th>
              <th>PVC Color</th>
              <th>Banding</th>
              <th>Edge Banding Boy1</th>
              <th>Edge Banding Boy2</th>
              <th>Edge Banding En1</th>
              <th>Edge Banding En2</th>
              <th>Drilling</th>
              <th>Channel Width</th>
              <th>Channel Length</th>
              <th>Part Size Length</th>
              <th>Part Size Width</th>
              <th>Macmazze Net Length</th>
              <th>Macmazze Net Width</th>
              <th>Notes</th>
              <th>Başlama Zamanı</th>
              <th>Bitiş Zamanı</th>
              <th>Güncelle</th>
            </tr>
          </thead>
          <tbody>
            {productsWithLots.map((product) =>
              product.lots.map((lot, lotIndex) =>
                lot.parts
                  .filter((part) =>
                    bandingFilter ? part.banding === bandingFilter : true
                  ) // Apply the filter here
                  .map((part, partIndex) => (
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
                      <td>{part.totalCount || "No Value"}</td>
                      <td>{part.pvcColor || "No Value"}</td>
                      <td>{part.banding || "No Value"}</td>
                      <td>{part.edgeBanding?.boy1 || "No Value"}</td>
                      <td>{part.edgeBanding?.boy2 || "No Value"}</td>
                      <td>{part.edgeBanding?.en1 || "No Value"}</td>
                      <td>{part.edgeBanding?.en2 || "No Value"}</td>
                      <td>{part.drilling || "No Value"}</td>
                      <td>{part.channel?.width || "No Value"}</td>
                      <td>{part.channel?.length || "No Value"}</td>
                      <td>{part.partSize?.length || "No Value"}</td>
                      <td>{part.partSize?.width || "No Value"}</td>
                      <td>{part.macmazzeNet?.macmazzeLenght || "No Value"}</td>
                      <td>{part.macmazzeNet?.macmazzeWidth || "No Value"}</td>
                      <td>{part.notes || "Açıklama girilmemiş!"}</td>
                      <td>
                        <input
                          type="datetime-local"
                          value={
                            startTimes[`${lot.lotNumber}-${part.id}`] || ""
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
                      </td>
                      <td>
                        <input
                          type="datetime-local"
                          value={endTimes[`${lot.lotNumber}-${part.id}`] || ""}
                          onChange={(e) =>
                            handleTimeChange(
                              lot.lotNumber,
                              part.id,
                              "end",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            updatePartStartTime(lot.lotNumber, part.id)
                          }
                        >
                          Başlama Zamanı Kaydet
                        </button>
                        <button
                          className="btn btn-secondary btn-sm mt-1"
                          onClick={() =>
                            updatePartEndTime(lot.lotNumber, part.id)
                          }
                        >
                          Bitiş Zamanı Kaydet
                        </button>
                      </td>
                    </tr>
                  ))
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Banding;
