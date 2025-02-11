import { useContext, useEffect, useState } from "react";
import { db } from "../firebase"; // Firebase bağlantısını içe aktarıyoruz
import { collection, getDocs, orderBy, query } from "firebase/firestore"; // Firestore fonksiyonları
import { Container, Row, Col, Card } from "react-bootstrap";

function LotList() {
  const [myLots, setMyLots] = useState([]); // Firestore'dan gelen lotları tutacak state

  useEffect(() => {
    const fetchLots = async () => {
      try {
        const lotsCollection = collection(db, "lots"); // "lots" koleksiyonuna referans al
        const q = query(lotsCollection, orderBy("lotNumber")); // "lotNumber" ile sıralama yap
        const snapshot = await getDocs(q); // Firestore'dan verileri al
        const lotsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })); // Verileri diziye çevir
        setMyLots(lotsData); // State'i güncelle
      } catch (error) {
        console.error("Veri çekme hatası:", error);
      }
    };

    fetchLots();
  }, []); // Bileşen yüklendiğinde sadece bir kez çalışacak

  return (
    <Container>
      <h1 className="mt-4">İş Emri Listesi</h1>
      {myLots.length === 0 ? (
        <p className="text-muted">Henüz bir iş eklenmedi.</p>
      ) : (
        <Row className="mt-3">
          {myLots.map((lot) => (
            <Col key={lot.id} md={4} sm={6} xs={12} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>Lot No: {lot.lotNumber}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {lot.productName}
                  </Card.Subtitle>
                  <Card.Subtitle className="mb-2 text-muted">
                    {lot.productCode}
                  </Card.Subtitle>
                  <Card.Text>
                    <strong>Adet:</strong> {lot.quantity} <br />
                    <strong>Durum:</strong> {lot.status}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}

export default LotList;
