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
} from "firebase/firestore";
import { LotContext } from "../context/LotContext";
import "bootstrap/dist/css/bootstrap.min.css";

const Banding = () => {
  const { products } = useContext(LotContext);
  const [productsWithLots, setProductsWithLots] = useState([]);
  const [startTimes, setStartTimes] = useState({});
  const [endTimes, setEndTimes] = useState({});
  const [bandingFilter, setBandingFilter] = useState(""); // Add filter state for banding

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
      type, // type is "banding" here
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
    });
  };

  // Fetch products and lots from Firestore
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
    fetchSavedTimes(); // Fetch saved times on component mount
  }, [products]);

  return (
    <div className="container mt-4">
      <h3 style={{ fontSize: "18px" }}>Ürünler ve Parçalar (Bantlama)</h3>

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
              <th>Material Color</th>
              <th>Thickness</th>
              <th>Unit Count</th>
              <th>Total Count</th>
              <th>PVC Color</th>
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
                      <td>
                        <input
                          type="datetime-local"
                          value={
                            startTimes[`${lot.lotNumber}-${part.id}-banding`] ||
                            ""
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
                            endTimes[`${lot.lotNumber}-${part.id}-banding`] ||
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
                            updatePartEndTime(lot.lotNumber, part.id, "banding")
                          }
                        >
                          Bitiş Ekle
                        </button>
                      </td>
                      <td></td>
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
