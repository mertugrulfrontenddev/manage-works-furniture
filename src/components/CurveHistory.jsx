import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Container } from "react-bootstrap";
const CurveHistory = () => {
  const [fetchedCurve, setFetchedCurve] = useState([]);
  const fetchCurve = async () => {
    // we have started getting all active lots
    const myLotsQuery = query(
      collection(db, "lots"),
      where("status", "==", "Üretimde")
    );

    const myActiveLots = await getDocs(myLotsQuery);

    const myActiveLotsArr = myActiveLots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // we have fetched all active lots

    const lotsWithParts = await Promise.all(
      myActiveLotsArr.map(async (lot) => {
        const refCollection = collection(
          db,
          "products",
          lot.productCode,
          "parts"
        );

        const partList = await getDocs(refCollection);

        const partsArr = partList.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        return { ...lot, parts: partsArr };
      })
    );

    const filteredLots = lotsWithParts.filter((lot) => lot !== null);

    const partsWithOp = await Promise.all(
      filteredLots.map(async (lot) => {
        const operationList = await Promise.all(
          lot.parts.map(async (part) => {
            const opKey = `${lot.lotNumber}-${part.id}-curve`;

            const q = query(
              collection(db, "operations"),
              where("operationKey", "==", opKey),
              where("curveEnd", "==", true)
            );

            const opData = await getDocs(q);

            if (opData.empty) {
              return null; // Bu parçayı dahil etmiyoruz
            }

            const opDataArr = opData.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            return { ...part, operations: opDataArr };
          })
        );

        const filteredOperations = operationList.filter(
          (part) => part !== null
        );

        if (filteredOperations.length === 0) return null;

        return { ...lot, parts: filteredOperations };
      })
    );

    const onlyValidLots = partsWithOp.filter((lot) => lot !== null);

    const sortedLots = onlyValidLots.sort((a, b) => {
      if (a.lotNumber < b.lotNumber) return -1;
      if (a.lotNumber > b.lotNumber) return 1;
      return 0;
    });
    setFetchedCurve(sortedLots);
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
    fetchCurve();
  }, []);

  return (
    <Container>
      <h2 className="bg-primary text-white p-2 fw-light my-4">
        Eğri Kenar Geçmişi
      </h2>
      <table
        className="table table-bordered table-striped "
        style={{ fontSize: "13px" }}
      >
        <thead>
          <tr>
            <th>Lot No</th>
            <th>Ürün Adı</th>
            <th>Ürün Kodu</th>
            <th>Cinsi</th>
            <th>Başlama</th>
            <th>Bitiş</th>
          </tr>
        </thead>
        <tbody>
          {fetchedCurve.map((lot) =>
            lot.parts.map((part) => (
              <tr className="table-primary">
                <td>{lot.lotNumber}</td>
                <td>{lot.productName}</td>
                <td>{lot.productCode}</td>
                <td>{part?.cinsi}</td>
                <td>{formatDate(part.operations[0]?.startTime)}</td>
                <td>{formatDate(part.operations[0]?.endTime)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Container>
  );
};

export default CurveHistory;
