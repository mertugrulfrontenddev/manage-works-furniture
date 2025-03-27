import { useContext, useEffect, useState } from "react";
import { Form, Row, Col, Card, Container, Button } from "react-bootstrap";
import { LotContext } from "../context/LotContext";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const PartDelete = () => {
  const { products } = useContext(LotContext);

  const [selectedProductCode, setSelectedProductCode] = useState("");
  const [productParts, setProductParts] = useState([]); // parts'ı tutacağımız state
  const [modalShow, setModelShow] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);

  const [productPartsCount, setProductPartsCount] = useState({});
  const handleProductSelect = (e) => {
    const selectedValue = e.target.value;
    setSelectedProductCode(selectedValue);
  };

  useEffect(() => {
    const fetchProductPartsCount = async () => {
      try {
        const partsCounts = {};

        // Tüm ürünler için parçaları paralel olarak alacak istekleri hazırlıyoruz
        const partsPromises = products.map(async (product) => {
          const partsRef = collection(db, "products", product.code, "parts");
          const partsSnapshot = await getDocs(partsRef);
          partsCounts[product.code] = partsSnapshot.size; // Parça sayısını objeye ekliyoruz
        });

        // Promise.all ile tüm parçaları paralel olarak çekiyoruz
        await Promise.all(partsPromises);

        setProductPartsCount(partsCounts); // Parça sayıları state'e atıyoruz
      } catch (error) {
        console.log("Parça sayıları alınırken hata oluştu:", error);
      }
    };

    fetchProductPartsCount();
  }, [products]);
  // products değiştiğinde tetiklenecek

  useEffect(() => {
    const fetchSelectedProduct = async () => {
      if (!selectedProductCode) return; // Ürün seçilmediyse işlem yapma

      try {
        // Seçilen ürünün parts alt koleksiyonuna erişim
        const partsRef = collection(
          db,
          "products",
          selectedProductCode,
          "parts"
        );

        // parts verilerini alıyoruz
        const partsSnapshot = await getDocs(partsRef);

        // Eğer parts koleksiyonu boşsa, boş dizi döndür
        if (!partsSnapshot.empty) {
          const partsList = partsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setProductParts(partsList); // parts verisini state'e atıyoruz
        } else {
          setProductParts([]); // parts yoksa boş dizi gönderiyoruz
          console.log("Bu ürüne ait parça bulunmamaktadır.");
        }
      } catch (error) {
        console.log("Veri çekerken hata oluştu:", error);
        setProductParts([]); // Hata durumunda boş dizi
      }
    };

    fetchSelectedProduct();
  }, [selectedProductCode]); // selectedProductCode değiştiğinde tetiklenecek

  const handleShowModal = (part) => {
    setModelShow(!modalShow);

    setSelectedPart(part);
  };
  const handleDeletePart = async (partId) => {
    try {
      const partRef = doc(db, "products", selectedProductCode, "parts", partId);

      await deleteDoc(partRef);

      setProductParts((prevParts) =>
        prevParts.filter((part) => part.id !== partId)
      );

      alert("Parça başarıyla silindi.");

      setModelShow(!modalShow);
    } catch (error) {}
  };

  return (
    <div>
      <h2>Parça Silme Sayfası</h2>
      <Row className="d-flex align-items-center justify-content-center">
        <Col md={6}>
          <Form.Group controlId="productSelect">
            <Form.Label>Ürün Seçin</Form.Label>
            <Form.Control
              as="select"
              value={selectedProductCode}
              onChange={handleProductSelect}
            >
              <option value="">Bir ürün seçiniz</option>

              {products.map((product) => (
                <option value={product.code} key={product.code}>
                  {product.code} - {product.name}-Parça Sayısı(
                  {productPartsCount[product.code]})
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Container>
        <Row className="mt-4 ms-3 d-flex justify-content-center aling-items-center">
          {/* Parçaları listele */}
          {productParts.length > 0 ? (
            productParts.map((part, index) => (
              <Col md={4} key={part.id}>
                <Card className="mt-3 custom-card">
                  <Card.Body>
                    <Card.Title
                      className="text-center"
                      style={{
                        backgroundColor: "#007bff",
                        color: "#fff",
                        borderRadius: "10px",
                        padding: "10px 0",
                      }}
                    >
                      {part.partName}
                    </Card.Title>
                    <Card.Body
                      className="bg-light"
                      style={{
                        padding: "15px",
                        borderRadius: "10px",
                        marginTop: "10px",
                      }}
                    >
                      <p>
                        <strong>Malzeme Rengi:</strong> {part.materialColor}
                      </p>
                      <p>
                        <strong>Cinsi:</strong> {part.cinsi}
                      </p>
                      <p>
                        <strong>Bantlama:</strong> {part.banding}
                      </p>
                      <p>
                        <strong>Delik:</strong> {part.drilling}
                      </p>
                    </Card.Body>
                    <Button
                      variant="danger"
                      className="mt-3"
                      onClick={() => {
                        handleShowModal(part);
                      }}
                    >
                      {" "}
                      Parça Sil
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col md={6}>
              <Card className="mt-3 custom-card  ">
                <Card.Body>
                  <Card.Title className="text-center">
                    Burada bir parça bulunmamaktadır
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
      {modalShow && (
        <div className="overlay">
          <div className="overlay-content">
            <div className="close-overlay">
              <Button
                variant="secondary"
                onClick={() => {
                  setModelShow(!modalShow);
                }}
              >
                X
              </Button>
            </div>
            <p>
              <h2>Silmek İstediğiniz Parça</h2>
              <p>
                <strong>Malzeme Rengi:</strong> {selectedPart.materialColor}
              </p>
              <p>
                <strong>Cinsi:</strong> {selectedPart.cinsi}
              </p>
              <p>
                <strong>Bantlama:</strong> {selectedPart.banding}
              </p>
              <p>
                <strong>Delik:</strong> {selectedPart.drilling}
              </p>
            </p>

            <Button
              variant="danger"
              onClick={() => {
                handleDeletePart(selectedPart.id);
              }}
            >
              Sil
            </Button>
            <Button
              variant="success"
              className="ms-3"
              onClick={() => {
                setModelShow(!modalShow);
              }}
            >
              İptal
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartDelete;
