import {
  collection,
  where,
  query,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

const CurveBanding = () => {
  const [mylots, setMylots] = useState([]);

  const [startTimes, setStartTimes] = useState({});
  const [endTimes, setEndTimes] = useState({});
  const [curveOperations, setCurveOperations] = useState({});
  const handleChangeStarTime = (lotNumber, partId, value) => {
    const key = `${lotNumber}-${partId}-start`;

    setStartTimes((prev) => ({ ...prev, [key]: value }));
  };

  const handleChangeEndTime = (lotNumber, partId, value) => {
    const key = `${lotNumber}-${partId}-end`;

    setEndTimes((prev) => ({ ...prev, [key]: value }));
  };

  const updatePartStartTime = async (lotNumber, partId) => {
    const startTime = startTimes[`${lotNumber}-${partId}-start`] || "";

    if (!startTime) return;

    const operationRef = doc(db, "operations", `${lotNumber}-${partId}-curve`);

    await setDoc(operationRef, {
      lotNumber,
      partId,
      startTime,
      curveEnd: false,
      operationKey: lotNumber + "-" + partId + "-curve",
      type: "curve",
      timestamp: new Date(),
    });
  };

  const updateEndTimes = async (lotNumber, partId) => {
    const endTime = endTimes[`${lotNumber}-${partId}-end`];

    const refEndTime = doc(db, "operations", `${lotNumber}-${partId}-curve`);

    await updateDoc(refEndTime, {
      endTime,
      timestamp: new Date(),
      curveEnd: true,
    });
  };

  const fetchCurveBandingOp = async () => {
    //operasyonlardan kritere uygun olanları çekiyorum
    const myOpQuery = query(
      collection(db, "operations"),
      where("type", "==", "delme"),
      where("delmeEnd", "==", true)
    );

    const myOperations = await getDocs(myOpQuery);

    // delmeEnd true ve tipi delme olan operasyonların tümü
    const myOperationsArr = myOperations.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // bunlar üretimde olan lotlarım
    const q = query(collection(db, "lots"), where("status", "==", "Üretimde"));

    const activeLots = await getDocs(q);

    const activeLotsArr = activeLots.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    //sadece operasyonlardaki lotnumaralarıyla eşleşenleri alacağız

    const activeLotsInOperations = activeLotsArr.filter((lot) =>
      myOperationsArr.some((op) => op.lotNumber === lot.lotNumber)
    );

    //matching lots with their parts according to productCode  query with firebase

    const myactiveLotsParts = await Promise.all(
      activeLotsInOperations.map(async (lot) => {
        const myPartQuery = query(
          collection(db, "products", lot.productCode, "parts"),
          where("banding", "==", "E Kenar")
        );

        const snapShot = await getDocs(myPartQuery);

        if (!snapShot.empty) {
          const myDataWithParts = snapShot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          return { ...lot, parts: myDataWithParts };
        }

        return { ...lot, parts: [] };
      })
    );

    //end

    const myactiveLotsPartsWithOp = await Promise.all(
      myactiveLotsParts.map(async (lot) => {
        const partsWithOperations = await Promise.all(
          lot.parts.map((part) => {
            const opKey = lot.lotNumber + "-" + part.id + "-delme";
            console.log(opKey);
            const matchingOps = myOperationsArr.filter(
              (myOp) => myOp.operationKey === opKey
            );

            return { ...part, operations: matchingOps };
          })
        );
        return { ...lot, parts: partsWithOperations };
      })
    );

    const sortedLots = myactiveLotsPartsWithOp.sort((a, b) => {
      if (a.lotNumber < b.lotNumber) return -1;
      if (a.lotNumber > b.lotNumber) return 1;
      return 0;
    });

    setMylots(sortedLots);
  };

  const fetchOpCurveEnd = () => {
    const snapShot = onSnapshot(
      collection(db, "operations"),
      (querySnapshot) => {
        const opCurveEnd = {};

        querySnapshot.forEach((doc) => (opCurveEnd[doc.id] = doc.data()));

        setCurveOperations(opCurveEnd);
      }
    );
  };

  useEffect(() => {
    fetchCurveBandingOp();
    fetchOpCurveEnd();
  }, []);

  return (
    <div className="container mt-4">
      <h3 className="bg-primary text-white p-2 fw-light">
        Ürünler ve Parçalar (Eğri Kenar)
      </h3>
      <table className="table table-bordered" style={{ fontSize: "13px" }}>
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
          {mylots.map((lot, lotIndex) =>
            lot.parts.map((part, partIndex) => {
              const isComplete =
                curveOperations[`${lot.lotNumber}-${part.id}-curve`]?.curveEnd;

              return (
                !isComplete && (
                  <tr key={`${lot.productCode}-${lotIndex}-${partIndex}`}>
                    <td>{lot.lotNumber || "No Value"}</td>
                    <td>{lot.productName}</td>
                    <td>{lot.productCode}</td>
                    <td>{part.partName || "No Value"}</td>
                    <td>{part.paketNo || "No Value"}</td>
                    <td>{part.cinsi || "No Value"}</td>
                    <td>{part.materialColor || "No Value"}</td>
                    <td>{part.thickness || "No Value"}</td>
                    <td>{part.unitCount || "No Value"}</td>
                    <td>{part.unitCount * lot.quantity || "No Value"}</td>
                    <td>{part.pvcColor || "No Value"}</td>
                    <td>{part.banding || "No Value"}</td>
                    <td>{part.drilling || "No Value"}</td>

                    <td>
                      <input
                        type="datetime-local"
                        value={startTimes[`${lot.lotNumber}-${part.id}-start`]}
                        onChange={(e) =>
                          handleChangeStarTime(
                            lot.lotNumber,
                            part.id,
                            e.target.value
                          )
                        }
                      />
                      <button
                        onClick={() =>
                          updatePartStartTime(lot.lotNumber, part.id)
                        }
                        className="btn btn-primary btn-sm mt-1"
                      >
                        Başla
                      </button>
                    </td>
                    <td>
                      <input
                        type="datetime-local"
                        value={endTimes[`${lot.lotNumber}-${part.id}-end`]}
                        onChange={(e) => {
                          handleChangeEndTime(
                            lot.lotNumber,
                            part.id,
                            e.target.value
                          );
                        }}
                      />

                      <button
                        className="btn btn-danger btn-sm mt-1"
                        onClick={() => {
                          updateEndTimes(lot.lotNumber, part.id);
                        }}
                      >
                        Bitiş
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
  );
};

export default CurveBanding;
