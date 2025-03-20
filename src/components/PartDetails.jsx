import { useState, useContext, useEffect } from "react";
import { db } from "../firebase";
import { LotContext } from "../context/LotContext";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

function PartDetails() {
  const { lots } = useContext(LotContext);
  const [selectedLot, setSelectedLot] = useState(null);
  const [myLots, setMyLots] = useState([]);
  const [partsData, setPartsData] = useState({}); // Parts verisini her lot için tutmak amacıyla obje kullanacağız

  useEffect(() => {
    const fetchLots = async () => {
      try {
        // Fetch lots in order
        const lotsQuery = query(
          collection(db, "lots"),
          orderBy("lotNumber", "asc")
        );
        const lotsSnapshot = await getDocs(lotsQuery);
        const fetchedLots = lotsSnapshot.docs.map((doc) => doc.data());
        setMyLots(fetchedLots);
      } catch (error) {
        console.error("Error fetching lots: ", error);
      }
    };

    fetchLots();
  }, []);

  const handleDetailsClick = async (lotNumber) => {
    setSelectedLot((prev) => (prev === lotNumber ? null : lotNumber));

    if (!partsData[lotNumber]) {
      // partsData'yı kontrol ediyoruz, zaten varsa tekrar veri çekmeye gerek yok
      const lot = myLots.find((l) => l.lotNumber === lotNumber);
      const productCode = lot?.productCode; // Burada düzeltme yapıldı

      if (productCode) {
        try {
          const partsRef = collection(db, "products", productCode, "parts");
          const partsSnapshot = await getDocs(partsRef);
          const fetchedPartsData = partsSnapshot.docs.map((doc) => doc.data());

          setPartsData((prev) => ({
            ...prev,
            [lotNumber]: fetchedPartsData,
          }));
        } catch (error) {
          console.error("Error fetching parts: ", error);
        }
      }
    }
  };

  return (
    <Container className="mt-4">
      {/* Check if there are no lots available */}
      {myLots.length === 0 ? (
        <p>Henüz iş emri yok</p> // Display message if no lots
      ) : (
        myLots.map((lot) => (
          <Card key={lot.lotNumber} className="mb-3 p-3">
            <Row>
              <Col md={3}>
                <p>
                  <strong>Ürün Kodu:</strong> {lot.productCode}
                </p>
                <p>
                  <strong>Ürün Adı:</strong> {lot.productName}
                </p>
                <p>
                  <strong>Lot No:</strong> {lot.lotNumber}
                </p>
                <p>
                  <strong>Adet:</strong> {lot.quantity}
                </p>
              </Col>
            </Row>
            <Button
              onClick={() => handleDetailsClick(lot.lotNumber)}
              variant="primary"
            >
              {selectedLot === lot.lotNumber ? "Detay Gizle" : "Detay Göster"}
            </Button>
            {selectedLot === lot.lotNumber && (
              <div className="mt-3">
                {partsData[lot.lotNumber]?.length > 0 ? (
                  partsData[lot.lotNumber].map((part, index) => (
                    <Card key={index} className="p-2 mb-2">
                      <Row>
                        <Col md={4}>
                          <p>
                            <strong>Parça Adı:</strong> {part.partName}
                          </p>
                          <p>
                            <strong>Paket Nosu:</strong> {part.paketNo}
                          </p>
                          <p>
                            <strong>Cinsi:</strong> {part.cinsi}
                          </p>
                          <p>
                            <strong>Renk:</strong> {part.materialColor}
                          </p>
                          <p>
                            <strong>Kalınlık:</strong>{" "}
                            {part.thickness || "No Value"}
                          </p>
                          <p>
                            <strong>Adet:</strong>{" "}
                            {part.unitCount || "No Value"}
                          </p>
                          <p>
                            <strong>Toplam Adet:</strong>{" "}
                            {part.totalCount || "No Value"}
                          </p>
                        </Col>
                        <Col md={4}>
                          <p>
                            <strong>PVC Rengi:</strong>{" "}
                            {part.pvcColor || "No Value"}
                          </p>

                          <p>
                            <strong>Bantlama:</strong>{" "}
                            {part.banding || "No Value"}
                          </p>
                          <p>
                            <strong>Kenar Bantlama:</strong>{" "}
                            {part.edgeBanding ? (
                              <div className="d-flex flex-column justify-content-between">
                                <p>
                                  <strong>En1:</strong>{" "}
                                  {part.edgeBanding.en1 || "No Value"}
                                </p>
                                <p>
                                  <strong>En2:</strong>{" "}
                                  {part.edgeBanding.en2 || "No Value"}
                                </p>
                                <p>
                                  <strong>Boy1:</strong>{" "}
                                  {part.edgeBanding.boy1 || "No Value"}
                                </p>
                                <p>
                                  <strong>Boy2:</strong>{" "}
                                  {part.edgeBanding.boy2 || "No Value"}
                                </p>
                              </div>
                            ) : (
                              <p>No Edge Banding</p>
                            )}
                          </p>
                        </Col>

                        <Col md={4}>
                          <p>
                            <strong>Delme:</strong>{" "}
                            {part.drilling || "No Value"}
                          </p>

                          <p>
                            <strong>Kanal:</strong> {part.channel}
                          </p>
                          <p>
                            <strong>Parça Ölçüsü:</strong>{" "}
                            {part.partSize
                              ? `${part.partSize.length} x ${part.partSize.width}`
                              : "No Size"}
                          </p>
                          <p>
                            <strong>Macmazze Ölçü:</strong>
                          </p>
                          <p>
                            <strong>Uzunluk:</strong>{" "}
                            {part.macmazzeNet?.macmazzeLenght || "No Value"}
                          </p>
                          <p>
                            <strong>Genişlik:</strong>{" "}
                            {part.macmazzeNet?.macmazzeWidth || "No Value"}
                          </p>

                          <p>
                            <strong>Açıklama:</strong>{" "}
                            {part.notes || "Bu parça için açıklama eklenmemiş"}
                          </p>
                        </Col>
                      </Row>
                    </Card>
                  ))
                ) : (
                  <p>No parts available for this lot.</p>
                )}
              </div>
            )}
          </Card>
        ))
      )}
    </Container>
  );
}

export default PartDetails;
