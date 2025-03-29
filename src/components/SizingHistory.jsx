import { useContext, useEffect, useState } from "react";
import { LotContext } from "../context/LotContext";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import LoadingSpinner from "./LoadingSpinner";

const SizingHistory = () => {
  const { products } = useContext(LotContext);
  const [activeLots, setActiveLots] = useState([]); // Active lots için state
  const [Loading, setLoading] = useState(true);

  const fetchActiveLots = async () => {
    try {
      const lotsQuery = query(
        collection(db, "lots"),
        where("status", "==", "Üretimde")
      );

      const lotsSnapshot = await getDocs(lotsQuery);
      const activeLots = lotsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // 1. Adım: Ürün kodlarına göre aktif lotları filtrele
      const matchedLots = activeLots.filter((lot) =>
        products.some((product) => product.code === lot.productCode)
      );

      // 2. Adım: Filtrelenmiş lotlarla boyut bilgilerini al ve cutting_operations ekle
      const activelotsWithSizes = await Promise.all(
        matchedLots.map(async (lot) => {
          const sizeCollection = collection(
            db,
            `products/${lot.productCode}/size`
          );
          const sizeSnap = await getDocs(sizeCollection);
          const sizeList = sizeSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // 3. Adım: Cutting operations ile ilişkili verileri alalım
          const activelotWithCuttingOps = await Promise.all(
            sizeList.map(async (size) => {
              // Cutting operations'ları yalnızca doğru boyutlar için çek
              const lotPlakaKey = `${lot.lotNumber}-${size.plakaTanim}`;

              // cutting_operations koleksiyonundaki verileri çek
              const cuttingOpsQuery = query(
                collection(db, "cutting_operations"),
                where("lotPlakaKey", "==", lotPlakaKey),
                where("plakaTanim", "==", size.plakaTanim), // plakaTanim'e göre eşleşme yapalım
                where("lotAdet", "==", size.lotAdet),
                where("ebatlamaTamamlandi", "==", true) // lotAdet'e göre eşleşme yapalım
              );
              const cuttingOpsSnapshot = await getDocs(cuttingOpsQuery);
              const cuttingOpsList = cuttingOpsSnapshot.docs.map((doc) =>
                doc.data()
              );

              // Eğer cutting_operations yoksa, bu boyutu göstermeyecek şekilde ayarlayacağız
              if (cuttingOpsList.length === 0) {
                return null; // Eğer cutting_operations yoksa, bu boyut verisini eklemeyeceğiz
              }

              return {
                ...size,
                cuttingOperations: cuttingOpsList, // cutting_operations'ları boyuta ekle
              };
            })
          );

          // null olanları filtrele (cutting_operations olmayan boyutları)
          const filteredSizes = activelotWithCuttingOps.filter(
            (size) => size !== null
          );

          return {
            ...lot,
            sizes: filteredSizes, // Sadece cutting_operations'ları olan boyutları ekle
          };
        })
      );

      activelotsWithSizes.sort((a, b) => {
        if (a.lotNumber < b.lotNumber) return -1;
        if (a.lotNumber > b.lotNumber) return 1;
        return 0;
      });
      setActiveLots(activelotsWithSizes); // Sonuçları state'e aktar
      setLoading(false);
    } catch (error) {}
  };

  // Tarih formatlama fonksiyonu
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
    fetchActiveLots();
  }, []);

  return (
    <div className="container my-4">
      <h2 className="bg-primary text-white p-2 fw-light"> Ebatlama Geçmişi</h2>
      {Loading ? (
        <LoadingSpinner />
      ) : activeLots.length === 0 ? (
        <div className="alert alert-warning" role="alert">
          Geçmişte Yapılmış Ebatlama Bilgisi Bulunamadı!!!
        </div>
      ) : (
        <table className="table table-bordered " style={{ fontSize: "13px" }}>
          <thead>
            <tr>
              <th>Lot No</th>
              <th>Ürün Kodu</th>
              <th>Ürün Adı</th>
              <th>Plaka Tanım</th>
              <th>Plaka Ölçüsü</th>
              <th>Plaka Adeti</th>
              <th>Lot Adet</th>
              <th>Ebatlama Başlama</th>
              <th>Ebatlama Bitiş</th>
            </tr>
          </thead>
          <tbody>
            {activeLots.map((lot, lotIndex) => {
              // Her lot için boyut sayısını al
              const rowSpan = lot.sizes.length;

              return lot.sizes.map((size, index) => (
                <tr key={index}>
                  {index === 0 ? (
                    <td
                      rowSpan={rowSpan}
                      style={{
                        backgroundColor:
                          lot.lotNumber % 2 === 0 ? "#f8f9fa" : "#ffffff",
                      }}
                    >
                      {lot.lotNumber}
                    </td> // İlk boyut için lot numarasını yaz
                  ) : null}
                  {index === 0 ? (
                    <td
                      rowSpan={rowSpan}
                      style={{
                        backgroundColor:
                          lot.lotNumber % 2 === 0 ? "#f8f9fa" : "#ffffff",
                      }}
                    >
                      {lot.productCode}
                    </td> // İlk boyut için ürün kodunu yaz
                  ) : null}
                  {index === 0 ? (
                    <td
                      rowSpan={rowSpan}
                      style={{
                        backgroundColor:
                          lot.lotNumber % 2 === 0 ? "#f8f9fa" : "#ffffff",
                      }}
                    >
                      {lot.productName}
                    </td> // İlk boyut için ürün adını yaz
                  ) : null}
                  <td
                    style={{
                      backgroundColor:
                        lot.lotNumber % 2 === 0 ? "#f8f9fa" : "#ffffff",
                    }}
                  >
                    {size.plakaTanim}
                  </td>
                  <td
                    style={{
                      backgroundColor:
                        lot.lotNumber % 2 === 0 ? "#f8f9fa" : "#ffffff",
                    }}
                  >
                    {size.plakaOlcu}
                  </td>
                  <td
                    style={{
                      backgroundColor:
                        lot.lotNumber % 2 === 0 ? "#f8f9fa" : "#ffffff",
                    }}
                  >
                    {size.plakaAdeti}
                  </td>
                  <td
                    style={{
                      backgroundColor:
                        lot.lotNumber % 2 === 0 ? "#f8f9fa" : "#ffffff",
                    }}
                  >
                    {size.lotAdet}
                  </td>

                  {/* Cutting operations bilgilerini ekle */}
                  <td
                    style={{
                      backgroundColor:
                        lot.lotNumber % 2 === 0 ? "#f8f9fa" : "#ffffff",
                    }}
                  >
                    {size.cuttingOperations &&
                      size.cuttingOperations.map((op, idx) => (
                        <div key={idx}>
                          <td
                            style={{
                              backgroundColor:
                                lot.lotNumber % 2 === 0 ? "#f8f9fa" : "#ffffff",
                            }}
                          >
                            {" "}
                            {formatDate(op.startDate)}
                          </td>
                        </div>
                      ))}
                  </td>

                  <td
                    style={{
                      backgroundColor:
                        lot.lotNumber % 2 === 0 ? "#f8f9fa" : "#ffffff",
                    }}
                  >
                    {size.cuttingOperations &&
                      size.cuttingOperations.map((op, idx) => (
                        <div key={idx}>
                          <td
                            style={{
                              backgroundColor:
                                lot.lotNumber % 2 === 0 ? "#f8f9fa" : "#ffffff",
                            }}
                          >
                            {formatDate(op.endDate)}
                          </td>
                        </div>
                      ))}
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SizingHistory;
