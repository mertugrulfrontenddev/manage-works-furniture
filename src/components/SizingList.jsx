import React, { useContext, useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { LotContext } from "../context/LotContext";

function SizingList() {
  const { products } = useContext(LotContext); // LotContext'ten ürünleri alıyoruz
  const [sizingData, setSizingData] = useState([]);
  const [activeProductCodes, setActiveProductCodes] = useState([]);
  const [activeLotDetails, setActiveLotDetails] = useState([]); // Aktif lot detaylarını tutacağız

  useEffect(() => {
    const fetchActiveLotOrders = async () => {
      try {
        const ordersRef = collection(db, "lots");
        const q = query(ordersRef, where("status", "==", "Üretimde"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const activeOrders = snapshot.docs.map((doc) => doc.data());
          const productCodes = activeOrders.map((order) => order.productCode);
          const lotDetails = activeOrders.map((order) => ({
            productCode: order.productCode,
            lotNumber: order.lotNumber, // Lot numarasını da alıyoruz
            quantity: order.quantity, // Quantity'yi de ekliyoruz
          }));

          setActiveProductCodes(productCodes);
          setActiveLotDetails(lotDetails); // Lot detaylarını kaydediyoruz
        });
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching active orders:", error);
      }
    };

    fetchActiveLotOrders();
  }, []);

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
              // Ürün ve lot numarasını eşleştiriyoruz
              const lotDetail = activeLotDetails.find(
                (lot) => lot.productCode === product.code
              );

              // Eğer lotAdet ve quantity eşleşiyorsa, bu boyutları ekliyoruz
              const matchingSizes = sizesList.filter((size) => {
                return size.lotAdet === lotDetail?.quantity;
              });

              if (matchingSizes.length > 0) {
                allSizingData.push({
                  productCode: product.code,
                  productName: product.name, // Ürün adı
                  lotNumber: lotDetail ? lotDetail.lotNumber : "No Lot", // Eğer lot numarası varsa, yoksa "No Lot"
                  sizes: matchingSizes, // Eşleşen boyutları ekliyoruz
                });
              }
            }
          }
        }

        setSizingData(allSizingData);
      } catch (error) {
        console.error("Error fetching sizing data:", error);
      }
    };

    if (activeProductCodes.length > 0) {
      fetchSizingData();
    }
  }, [activeProductCodes, products, activeLotDetails]);

  return (
    <div style={{ maxWidth: "90%", margin: "0 auto" }}>
      <h2>Total Sizing Data: {sizingData.length}</h2>
      {sizingData.length === 0 ? (
        <p>No sizing data available for active orders.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f4f4f4", fontWeight: "bold" }}>
              <th style={thStyle}>Product Code</th>
              <th style={thStyle}>Product Name</th>
              <th style={thStyle}>Lot Number</th> {/* Lot numarasını ekledik */}
              <th style={thStyle}>Plaka Tanım</th>
              <th style={thStyle}>Plaka Adeti</th>
              <th style={thStyle}>Lot Adet</th>
            </tr>
          </thead>
          <tbody>
            {sizingData.map((data, index) =>
              data.sizes.map((size, idx) => (
                <tr key={`${index}-${idx}`} style={trStyle}>
                  <td style={tdStyle}>{data.productCode}</td>
                  <td style={tdStyle}>{data.productName}</td>
                  <td style={tdStyle}>{data.lotNumber}</td> {/* Lot numarası */}
                  <td style={tdStyle}>{size.plakaTanim}</td>
                  <td style={tdStyle}>{size.plakaAdeti}</td>
                  <td style={tdStyle}>{size.lotAdet}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ✅ Stil ayarları
const thStyle = {
  padding: "6px",
  border: "1px solid #ddd",
  textAlign: "left",
  backgroundColor: "#e0e0e0",
  fontSize: "14px",
};

const tdStyle = {
  padding: "6px",
  border: "1px solid #ddd",
  fontSize: "14px",
};

const trStyle = {
  backgroundColor: "#fff",
};

export default SizingList;
