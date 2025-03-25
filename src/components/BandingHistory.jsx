import { collection, getDocs, query, where } from "firebase/firestore";

import { db } from "../firebase";
import React, { useContext, useEffect, useState } from "react";
import { LotContext } from "../context/LotContext";

const BandingHistory = () => {
  const [bandingLots, setBandingLots] = useState([]);
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
            const lotPartIdKey = `${lot.lotNumber}-${part.id}-banding`;
            console.log(lotPartIdKey);
            const opCollection = collection(db, "operations");
            const opQuery = query(
              opCollection,
              where("operationKey", "==", lotPartIdKey),
              where("bandingEnd", "==", true)
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

    setBandingLots(validLots);
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
      <h2 className="bg-primary text-white p-2 fw-light">Bantlama Geçmişi</h2>
      <table className="table table-bordered" style={{ fontSize: "13px" }}>
        <thead>
          <tr className="bg-primary">
            <th>Lot No</th>
            <th>Ürün Adı</th>
            <th>Ürün Kodu</th>
            <th>Part Cinsi</th>
            <th>Başlama</th>
            <th>Bitiş</th>
          </tr>
        </thead>
        <tbody>
          {bandingLots.map((lot) => {
            const rowSpan = lot.parts.length; // Lot'a ait toplam parça sayısını alıyoruz

            return lot.parts.map((part, index) => {
              // Eğer part.operations dizisi varsa, işlemi al
              const op =
                part.operations && part.operations.length > 0
                  ? part.operations[0]
                  : null;

              return (
                <tr key={`${part.id}-${op ? op.id : "no-op"}`}>
                  {index === 0 ? (
                    <>
                      <td rowSpan={rowSpan}>{lot.lotNumber}</td>
                      <td rowSpan={rowSpan}>{lot.productName}</td>
                      <td rowSpan={rowSpan}>{lot.productCode}</td>
                    </>
                  ) : null}

                  <td>{part.cinsi}</td>
                  <td>{formatDate(op?.startTime)}</td>
                  <td>{formatDate(op?.endTime)}</td>
                </tr>
              );
            });
          })}
        </tbody>
      </table>
    </div>
  );
};

export default BandingHistory;
