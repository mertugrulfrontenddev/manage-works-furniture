import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import React, { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { Table, Container } from "react-bootstrap";

const DrillingHistory = () => {
  const [drillingLots, setDrillingLots] = useState([]);
  const [loading, setLoading] = useState(true); // Loading durumu ekliyoruz
  const fetchBanding = async () => {
    const querySnapshot = await getDocs(collection(db, "lots"));

    const lotsArr = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const lotsWithParts = await Promise.all(
      lotsArr.map(async (lot) => {
        const partsCollection = collection(
          db,
          `products/${lot.productCode}/parts`
        );

        const partsSnap = await getDocs(partsCollection);

        const partsList = partsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        return { ...lot, parts: partsList };
      })
    );

    const partsWithOperations = await Promise.all(
      lotsWithParts.map(async (lot) => {
        const updatedParts = await Promise.all(
          lot.parts.map(async (part) => {
            const lotPartIdKey = `${lot.lotNumber}-${part.id}-delme`;

            const opCollection = collection(db, "operations");
            const opQuery = query(
              opCollection,
              where("operationKey", "==", lotPartIdKey),
              where("delmeEnd", "==", true)
            );

            // Sorguyu getDocs ile kullan
            const opSnapshot = await getDocs(opQuery);

            // Eğer operasyon yoksa, bu parçayı görmeme kararını verebiliriz
            if (opSnapshot.empty) {
              return null; // Bu parçayı dahil etmiyoruz
            }

            const partsoperations = opSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            return {
              ...part,
              lotPartIdKey,
              operations: partsoperations,
            };
          })
        );

        // Null olan parçaları filtreliyoruz, sadece operasyonu olanları dahil ediyoruz
        const filteredParts = updatedParts.filter((part) => part !== null);

        // Eğer hiçbir parçanın operasyonu yoksa, bu lotu hiç göstermiyoruz
        if (filteredParts.length === 0) {
          return null; // Bu lotu dahil etmiyoruz
        }

        return { ...lot, parts: filteredParts };
      })
    );

    // Null olan lotları filtreliyoruz, yalnızca operasyonu olan lotları dahil ediyoruz
    const validLots = partsWithOperations.filter((lot) => lot !== null);

    // Eğer validLots boşsa, hata mesajı verebilirsin
    if (validLots.length === 0) {
      console.log("No valid lots found with operations.");
    }

    validLots.sort((a, b) => {
      if (a.lotNumber < b.lotNumber) return -1;
      if (a.lotNumber > b.lotNumber) return 1;
      return 0;
    });

    setDrillingLots(validLots);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, "0"); // Gün
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Ay (0'dan başladığı için 1 ekliyoruz)
    const year = date.getFullYear(); // Yıl
    const hours = String(date.getHours()).padStart(2, "0"); // Saat
    const minutes = String(date.getMinutes()).padStart(2, "0"); // Dakika

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };
  useEffect(() => {
    fetchBanding();
  }, []);
  return (
    <div className="container">
      <h2 className="bg-primary text-white p-2 fw-light">Delme Geçmişi</h2>
      <table className="table table-bordered" style={{ fontSize: "13px" }}>
        <thead>
          <tr>
            <th>Lot No</th>
            <th>Ürün Adı</th>
            <th>Ürün Kodu</th>
            <th>Part Cinsi</th>
            <th>Delik</th>
            <th>Başlama</th>
            <th>Bitiş</th>
          </tr>
        </thead>
        <tbody>
          {drillingLots.map((lot, lotIndex) => {
            const rowSpan = lot.parts.length; // Lot'a ait toplam parça sayısını alıyoruz

            // Tek satırları gri, çift satırları beyaz yap

            return lot.parts.map((part, index) => {
              const op =
                part.operations && part.operations.length > 0
                  ? part.operations[0]
                  : null;
              const rowIndex = lotIndex + index;

              return (
                <tr
                  key={`${part.id}-${op ? op.id : "no-op"}`}
                  className={rowIndex % 2 === 0 ? "bg-light" : ""}
                >
                  {index === 0 ? (
                    <>
                      <td
                        rowSpan={rowSpan}
                        style={{
                          backgroundColor:
                            lotIndex % 2 === 0 ? "#f8f9fa" : "#ffffff",
                        }}
                      >
                        {lot.lotNumber}
                      </td>
                      <td
                        rowSpan={rowSpan}
                        style={{
                          backgroundColor:
                            lotIndex % 2 === 0 ? "#f8f9fa" : "#ffffff",
                        }}
                      >
                        {lot.productName}
                      </td>
                      <td
                        rowSpan={rowSpan}
                        style={{
                          backgroundColor:
                            lotIndex % 2 === 0 ? "#f8f9fa" : "#ffffff",
                        }}
                      >
                        {lot.productCode}
                      </td>
                    </>
                  ) : null}

                  <td
                    style={{
                      backgroundColor:
                        lotIndex % 2 === 0 ? "#f8f9fa" : "#ffffff",
                    }}
                  >
                    {part.cinsi}
                  </td>
                  <td
                    style={{
                      backgroundColor:
                        lotIndex % 2 === 0 ? "#f8f9fa" : "#ffffff",
                    }}
                  >
                    {part.drilling}
                  </td>
                  <td
                    style={{
                      backgroundColor:
                        lotIndex % 2 === 0 ? "#f8f9fa" : "#ffffff",
                    }}
                  >
                    {formatDate(op?.startTime)}
                  </td>
                  <td
                    style={{
                      backgroundColor:
                        lotIndex % 2 === 0 ? "#f8f9fa" : "#ffffff",
                    }}
                  >
                    {formatDate(op?.endTime)}
                  </td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DrillingHistory;
