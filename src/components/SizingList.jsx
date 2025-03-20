import React, { useContext, useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { LotContext } from "../context/LotContext";

function SizingList() {
  const { products } = useContext(LotContext);
  const [sizingData, setSizingData] = useState([]);
  const [activeProductCodes, setActiveProductCodes] = useState([]);
  const [activeLotDetails, setActiveLotDetails] = useState([]);
  const [dates, setDates] = useState({});

  // Fetch active lot orders
  useEffect(() => {
    const fetchActiveLotOrders = async () => {
      try {
        const ordersRef = collection(db, "lots");
        const q = query(
          ordersRef,
          where("status", "==", "Üretimde"),
          orderBy("lotNumber")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const activeOrders = snapshot.docs.map((doc) => doc.data());
          activeOrders.sort((a, b) => a.lotNumber - b.lotNumber);

          const productCodes = activeOrders.map((order) => order.productCode);
          const lotDetails = activeOrders.map((order) => ({
            productCode: order.productCode,
            lotNumber: order.lotNumber,
            quantity: order.quantity,
          }));

          setActiveProductCodes(productCodes);
          setActiveLotDetails(lotDetails);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching active orders:", error);
      }
    };

    fetchActiveLotOrders();
  }, []);

  // Fetch sizing data based on active product codes
  useEffect(() => {
    const fetchSizingData = async () => {
      try {
        let allSizingData = [];

        for (const product of products) {
          if (activeProductCodes.includes(product.code)) {
            const sizesRef = collection(db, "products", product.code, "size");
            const sizesSnapshot = await getDocs(sizesRef);

            if (!sizesSnapshot.empty) {
              const sizesList = sizesSnapshot.docs.map((doc) => doc.data());
              const lotDetailsForProduct = activeLotDetails.filter(
                (lot) => lot.productCode === product.code
              );

              lotDetailsForProduct.forEach((lotDetail) => {
                const matchingSizes = sizesList.filter(
                  (size) => size.lotAdet === lotDetail.quantity
                );

                if (matchingSizes.length > 0) {
                  allSizingData.push({
                    productCode: product.code,
                    productName: product.name,
                    lotNumber: lotDetail.lotNumber,
                    sizes: matchingSizes,
                  });
                }
              });
            }
          }
        }

        allSizingData.sort((a, b) => a.lotNumber - b.lotNumber);

        setSizingData(allSizingData);
      } catch (error) {
        console.error("Error fetching sizing data:", error);
      }
    };

    if (activeProductCodes.length > 0) {
      fetchSizingData();
    }
  }, [activeProductCodes, products, activeLotDetails]);

  // Fetch and display start and end times for existing cutting operations
  useEffect(() => {
    const fetchCuttingOperations = async () => {
      try {
        const operationsRef = collection(db, "cutting_operations");
        const operationsSnapshot = await getDocs(operationsRef);

        operationsSnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const lotPlakaKey = data.lotPlakaKey;

          setDates((prevDates) => ({
            ...prevDates,
            [lotPlakaKey]: {
              startDate: data.startDate || "",
              endDate: data.endDate || "",
            },
          }));
        });
      } catch (error) {
        console.error("Error fetching cutting operations:", error);
      }
    };

    fetchCuttingOperations();
  }, []);

  // Save start date to Firebase
  const handleSaveStartDate = async (lotNumber, plakaTanim) => {
    try {
      const lotPlakaKey = `${lotNumber}-${plakaTanim}`;
      const { startDate } = dates[lotPlakaKey] || {};

      if (startDate) {
        const docRef = doc(db, "cutting_operations", lotPlakaKey);

        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          await updateDoc(docRef, { startDate });
          console.log("Start date updated successfully!");
        } else {
          await setDoc(docRef, {
            startDate,
            lotPlakaKey,
            plakaTanim,
            lotNumber,
          });
          console.log("Start date saved successfully!");
        }
      } else {
        console.log("Start date is required!");
      }
    } catch (error) {
      console.error("Error saving start date:", error);
    }
  };

  // Save end date to Firebase
  const handleSaveEndDate = async (lotNumber, plakaTanim) => {
    try {
      const lotPlakaKey = `${lotNumber}-${plakaTanim}`;
      const { endDate } = dates[lotPlakaKey] || {};

      if (endDate) {
        const docRef = doc(db, "cutting_operations", lotPlakaKey);

        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // Ebatlama tamamlandı bayrağını ekliyoruz
          await updateDoc(docRef, {
            endDate,
            ebatlamaTamamlandi: true, // Burada bayrağı ekliyoruz
          });
          console.log("End date updated and cutting operation completed!");
        } else {
          await setDoc(docRef, {
            endDate,
            lotPlakaKey,
            ebatlamaTamamlandi: true, // Yeni veriyi ekliyoruz
          });
          console.log("End date saved and cutting operation completed!");
        }
      } else {
        console.log("End date is required!");
      }
    } catch (error) {
      console.error("Error saving end date:", error);
    }
  };

  // Handle date changes for start and end date inputs
  const handleDateChange = (lotNumber, plakaTanim, type, value) => {
    setDates((prevDates) => ({
      ...prevDates,
      [`${lotNumber}-${plakaTanim}`]: {
        ...prevDates[`${lotNumber}-${plakaTanim}`],
        [type]: value,
      },
    }));
  };

  const [cuttingOperations, setCuttingOperations] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "cutting_operations"),
      (querySnapshot) => {
        const operations = {};
        querySnapshot.forEach((doc) => {
          operations[doc.id] = doc.data();
        });
        setCuttingOperations(operations); // Veriyi güncelle
      }
    );

    // Unsubscribe (temizleme) işlemi
    return () => unsubscribe();
  }, []);
  return (
    <div style={{ maxWidth: "90%", margin: "0 auto" }}>
      <h2>Toplam Ebatlanan Lot Sayısı: {sizingData.length}</h2>
      {sizingData.length === 0 ? (
        <p>No sizing data available for active orders.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f4f4f4", fontWeight: "bold" }}>
              <th style={thStyle}>Lot Number</th>
              <th style={thStyle}>Product Code</th>
              <th style={thStyle}>Product Name</th>
              <th style={thStyle}>Plaka Tanım</th>
              <th style={thStyle}>Plaka Ölçüsü</th>
              <th style={thStyle}>Plaka Adeti</th>
              <th style={thStyle}>Lot Adet</th>
              <th style={thStyle}>Başlama Zamanı</th>
              <th style={thStyle}>Bitiş Zamanı</th>
            </tr>
          </thead>
          <tbody>
            {sizingData.map((data, index) =>
              data.sizes.map((size, idx) => {
                const lotPlakaKey = `${data.lotNumber}-${size.plakaTanim}`;
                const isCompleted =
                  cuttingOperations[lotPlakaKey]?.ebatlamaTamamlandi;
                return (
                  !isCompleted && (
                    <tr key={`${index}-${idx}`} style={{ ...trStyle }}>
                      <td style={tdStyle}>{data.lotNumber}</td>
                      <td style={tdStyle}>{data.productCode}</td>
                      <td style={tdStyle}>{data.productName}</td>

                      <td style={tdStyle}>{size.plakaTanim}</td>
                      <td style={tdStyle}>{size.plakaOlcu}</td>
                      <td style={tdStyle}>{size.plakaAdeti}</td>
                      <td style={tdStyle}>{size.lotAdet}</td>
                      <td style={tdStyle}>
                        <input
                          type="datetime-local"
                          value={dates[lotPlakaKey]?.startDate || ""}
                          onChange={(e) =>
                            handleDateChange(
                              data.lotNumber,
                              size.plakaTanim,
                              "startDate",
                              e.target.value
                            )
                          }
                        />
                        <button
                          className="btn btn-primary"
                          onClick={() =>
                            handleSaveStartDate(data.lotNumber, size.plakaTanim)
                          }
                        >
                          Başla
                        </button>
                      </td>
                      <td style={tdStyle}>
                        <input
                          type="datetime-local"
                          value={dates[lotPlakaKey]?.endDate || ""}
                          onChange={(e) =>
                            handleDateChange(
                              data.lotNumber,
                              size.plakaTanim,
                              "endDate",
                              e.target.value
                            )
                          }
                        />
                        <button
                          className="btn btn-danger "
                          onClick={() =>
                            handleSaveEndDate(data.lotNumber, size.plakaTanim)
                          }
                        >
                          Bitir
                        </button>
                      </td>
                    </tr>
                  )
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center",
  backgroundColor: "#f4f4f4",
  fontSize: "12px",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "center",
};

const trStyle = {
  borderBottom: "1px solid #ddd",
  fontSize: "12px",
};

export default SizingList;
