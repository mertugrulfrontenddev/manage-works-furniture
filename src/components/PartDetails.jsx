import { useState, useContext, useEffect } from "react";
import { LotContext } from "../context/LotContext";
import { Container, Row, Col, Button, Card } from "react-bootstrap";

function PartDetails() {
  const { lots, products } = useContext(LotContext);
  const [selectedLot, setSelectedLot] = useState(null);
  const [myLots, setMyLots] = useState([]);
  const [myProducts, setProducts] = useState([]);

  useEffect(() => {
    const storedLots = JSON.parse(localStorage.getItem("lots")) || [];

    setMyLots(storedLots);
  }, []);

  useEffect(() => {
    const storedProducts = JSON.parse(localStorage.getItem("products")) || [];

    setProducts(storedProducts);
  }, []);

  const handleDetailsClick = (lotNumber) => {
    setSelectedLot(selectedLot === lotNumber ? null : lotNumber);
  };

  return (
    <Container className="mt-4">
      {myLots.map((lot) => {
        const product = myProducts.find((p) => p.code === lot.productCode);

        return (
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
                {product?.parts.map((part, index) => (
                  <Card key={index} className="p-2 mb-2">
                    <Row>
                      <Col md={3}>
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
                      </Col>
                      <Col md={3}>
                        <p>
                          <strong>PVC Rengi:</strong> {part.pvcColor}
                        </p>
                        <p>
                          <strong>Edge Banding:</strong>{" "}
                          {part.edgeBanding.eBanding ? "✔" : "✘"}
                        </p>
                        <p>
                          <strong>Delme:</strong>{" "}
                          {part.drilling.sevenKafa ? "✔" : "✘"}
                        </p>
                      </Col>
                      <Col md={3}>
                        <p>
                          <strong>Kanal:</strong> Boy: {part.channel.length} x
                          En: {part.channel.width}
                        </p>
                        <p>
                          <strong>Parça Ölçüsü:</strong> {part.partSize.length}{" "}
                          x {part.partSize.width}
                        </p>
                      </Col>
                      <Col md={3}>
                        <p>
                          <strong>Açıklama:</strong>{" "}
                          {part.notes || "No additional notes"}
                        </p>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        );
      })}
    </Container>
  );
}

export default PartDetails;
