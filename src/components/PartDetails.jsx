import { useState, useContext, useEffect } from "react";
import { db } from "../firebase";
import { LotContext } from "../context/LotContext";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

function PartDetails() {
  const { lots } = useContext(LotContext);
  const [selectedLot, setSelectedLot] = useState(null);
  const [myLots, setMyLots] = useState([]);
  const [fetchedParts, setFetchedParts] = useState([]);

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
    setSelectedLot(selectedLot === lotNumber ? null : lotNumber);

    if (selectedLot !== lotNumber) {
      // Fetch parts for the selected lot's product code
      const lot = myLots.find((l) => l.lotNumber === lotNumber);
      const productCode = lot?.productCode;

      if (productCode) {
        const partsRef = collection(db, "products", productCode, "parts");
        const partsSnapshot = await getDocs(partsRef);
        const fetchedPartsData = partsSnapshot.docs.map((doc) => doc.data());
        setFetchedParts(fetchedPartsData); // Store fetched parts in state
      }
    }
  };

  return (
    <Container className="mt-4">
      {myLots.map((lot) => (
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
              {fetchedParts.length > 0 ? (
                fetchedParts.map((part, index) => (
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
                ))
              ) : (
                <p>No parts available for this lot.</p>
              )}
            </div>
          )}
        </Card>
      ))}
    </Container>
  );
}

export default PartDetails;
