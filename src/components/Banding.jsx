import { useEffect, useState, useContext } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { LotContext } from "../context/LotContext";
import "bootstrap/dist/css/bootstrap.min.css";

const Banding = () => {
  const { products } = useContext(LotContext);
  const [productsWithLots, setProductsWithLots] = useState([]);
  const [selectedBanding, setSelectedBanding] = useState("");

  const handleBandingChange = (event) => {
    setSelectedBanding(event.target.value);
  };

  useEffect(() => {
    const fetchLotAndProducts = async () => {
      // Lotları getiriyoruz (status "Üretimde" olanlar)
      const lotQuery = query(
        collection(db, "lots"),
        where("status", "==", "Üretimde")
      );
      const lotSnapshot = await getDocs(lotQuery);
      const lots = lotSnapshot.docs.map((doc) => doc.data());

      // Ürünler ile eşleştirme yapıyoruz
      const productList = await Promise.all(
        products.map(async (product) => {
          // Ürünle eşleşen tüm lotları buluyoruz
          const matchedLots = lots.filter(
            (lot) => lot.productCode === product.code
          );

          // Ürünle eşleşen tüm parçaları alıyoruz
          const partsCollection = collection(
            db,
            `products/${product.code}/parts`
          );
          const partSnapshot = await getDocs(partsCollection);
          const partsList = partSnapshot.docs.map((doc) => doc.data());

          // Her lot için parçaları ilişkilendiriyoruz
          const lotsWithParts = matchedLots.map((lot) => {
            const partsWithLot = partsList.map((part) => {
              return { ...part, lotNumber: lot.lotNumber };
            });

            return { ...lot, parts: partsWithLot };
          });

          return { ...product, lots: lotsWithParts }; // Ürünle birlikte lotları ekliyoruz
        })
      );

      setProductsWithLots(productList);
    };

    fetchLotAndProducts();
  }, [products]);

  // Bantlama türüne göre filtreleme
  const filteredProducts = selectedBanding
    ? productsWithLots.map((product) => {
        const filteredLots = product.lots.map((lot) => {
          // Part bazında filtreleme
          const filteredParts = lot.parts.filter(
            (part) => part.banding === selectedBanding
          );
          return { ...lot, parts: filteredParts }; // Filtrelenmiş parçalarla lot'u güncelle
        });

        return { ...product, lots: filteredLots }; // Filtrelenmiş lotlarla ürünü güncelle
      })
    : productsWithLots; // Bantlama seçilmediyse tüm ürünleri göster

  return (
    <div className="container mt-4">
      <h3 style={{ fontSize: "18px" }}>Ürünler ve Parçalar</h3>

      <label htmlFor="banding">Bantlama Türü:</label>
      <select
        id="banding"
        value={selectedBanding}
        onChange={handleBandingChange}
        className="form-select mb-3"
      >
        <option value="">Tüm Bantlamalar</option>
        <option value="K Bandlama">K Bandlama</option>
        <option value="B Bandlama">B Bandlama</option>
        <option value="E Kenar">E Kenar</option>
      </select>

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
              <th>Renk</th>
              <th>Kalınlık</th>
              <th>Adet</th>
              <th>Toplam Adet</th>
              <th>PVC Rengi</th>
              <th>Bantlama</th>
              <th>Kenar En1</th>
              <th>Kenar En2</th>
              <th>Kenar Boy1</th>
              <th>Kenar Boy2</th>
              <th>Delme</th>
              <th>Kanal Boy</th>
              <th>Kanal En</th>
              <th>Parça Ölçüsü U</th>
              <th>Parça Ölçüsü G</th>
              <th>Macmazze U</th>
              <th>Macmazze G</th>
              <th>Açıklama</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) =>
              product.lots.map((lot, lotIndex) =>
                lot.parts.length > 0 ? (
                  lot.parts.map((part, partIndex) => (
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
                      <td>{part.edgeBanding?.en1 || "No Value"}</td>
                      <td>{part.edgeBanding?.en2 || "No Value"}</td>
                      <td>{part.edgeBanding?.boy1 || "No Value"}</td>
                      <td>{part.edgeBanding?.boy2 || "No Value"}</td>
                      <td>{part.drilling || "No Value"}</td>
                      <td>{part.channel?.width || "No Value"}</td>
                      <td>{part.channel?.length || "No Value"}</td>
                      <td>{part.partSize.length || "No Value"}</td>
                      <td>{part.partSize.width || "No Value"}</td>
                      <td>{part.macmazzeNet?.macmazzeLenght || "No Value"}</td>
                      <td>{part.macmazzeNet?.macmazzeWidth || "No Value"}</td>
                      <td>{part.notes || "Açıklama girilmemiş!"}</td>
                    </tr>
                  ))
                ) : (
                  <tr key={lot.lotNumber}>
                    <td>{lot.lotNumber || "No Value"}</td>
                    <td colSpan="20">
                      Bu iş emrine ait parça bulunmamaktadır.
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Banding;
