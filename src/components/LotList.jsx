import { useContext, useEffect, useState } from "react";
import { LotContext } from "../context/LotContext";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card } from "react-bootstrap";

function LotList() {
  const { lots } = useContext(LotContext); // Context'ten gelen lotlar
  const [myLots, setMyLots] = useState([]); // localStorage'dan alınan lotları tutacak state

  // Sayfa yüklendiğinde localStorage'dan veriyi almak ve state'e kaydetmek
  useEffect(() => {
    const storedLots = JSON.parse(localStorage.getItem("lots")) || []; // localStorage'dan veriyi al, yoksa boş dizi
    setMyLots(storedLots); // Veriyi state'e kaydet
  }, []); // Boş bağımlılık dizisi ile sadece bir kere çalışmasını sağlıyoruz (sayfa yüklenince)

  return (
    <Container>
      <h1 className="mt-4">İş Emri Listesi</h1>
      {myLots.length === 0 ? (
        <div>
          <p className="text-muted">
            Henüz bir iş eklenmedi. İş Emri eklemek için
          </p>
          <Link className="nav-link" to="/lotform">
            TIKLAYINIZ...
          </Link>
        </div>
      ) : (
        <Row className="mt-3">
          {myLots.map((lot) => (
            <Col key={lot.lotNumber} md={4} sm={6} xs={12} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>Lot No: {lot.lotNumber}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {lot.productName}
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
