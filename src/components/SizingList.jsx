import React, { useContext, useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { LotContext } from "../context/LotContext";

function SizingList() {
  const { products } = useContext(LotContext); // LotContext'ten ürünleri alıyoruz
  const [sizingData, setSizingData] = useState([]);

  useEffect(() => {
    const fetchSizingData = async () => {
      try {
        let allSizingData = [];

        // 1. Ürünler üzerinden dönüyoruz
        for (const product of products) {
          const productCode = product.code; // Her ürüne ait productCode

          // 2. Her ürün için size (ebat) koleksiyonunu çekiyoruz
          const sizesRef = collection(db, "products", productCode, "size");
          const sizesSnapshot = await getDocs(sizesRef);

          // 3. Eğer ebatlar verisi varsa, bunu allSizingData dizisine ekliyoruz
          if (!sizesSnapshot.empty) {
            const sizesList = sizesSnapshot.docs.map((doc) => doc.data());
            allSizingData.push({ productCode, sizes: sizesList });
          } else {
            console.log(`No sizing data found for productCode: ${productCode}`);
          }
        }

        // 4. Verileri state'e kaydediyoruz
        setSizingData(allSizingData);
      } catch (error) {
        console.error("Error fetching sizing data:", error);
      }
    };

    // Veriyi çekerken sadece products varsa çalıştırıyoruz
    if (products.length > 0) {
      fetchSizingData();
    }
  }, [products]);

  return (
    <div>
      {sizingData.length === 0 ? (
        <p>No sizing data available.</p>
      ) : (
        <div>
          <h2>Total Sizing Data: {sizingData.length}</h2>
          {sizingData.map((data, index) => (
            <div key={index}>
              <h3>Product Code: {data.productCode}</h3>
              <ul>
                {data.sizes.map((size, idx) => (
                  <li key={idx}>{JSON.stringify(size)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SizingList;
