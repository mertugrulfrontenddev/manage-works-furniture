import { useState, useContext } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { LotContext } from "../context/LotContext";
import { db } from "../firebase"; // Import Firestore
import { doc, collection, addDoc } from "firebase/firestore";

const AddPartForm = () => {
  const { products } = useContext(LotContext);
  const [part, setPart] = useState({
    productCode: "",
    productName: "",
    partName: "",
    paketNo: "",
    cinsi: "",
    thickness: "",
    unitCount: "",
    totalCount: "",
    materialColor: "",
    macmazzeNet: {
      macmazzeLenght: "",
      macmazzeWidth: "",
    },
    pvcColor: "",
    edgeBanding: { eBanding: false },
    drilling: { sevenKafa: false },
    channel: { length: "", width: "" },
    partSize: { length: "", width: "" },
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPart((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (e, category) => {
    const { name, value } = e.target;
    setPart((prev) => ({
      ...prev,
      [category]: { ...prev[category], [name]: value },
    }));
  };

  const handleProductChange = (e) => {
    const selectedProduct = products.find((p) => p.code === e.target.value);
    setPart((prev) => ({
      ...prev,
      productCode: selectedProduct?.code || "",
      productName: selectedProduct?.name || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!part.productCode) {
      alert("Lütfen bir ürün seçin.");
      return;
    }

    try {
      const productRef = doc(db, "products", part.productCode); // Get product document reference
      const partsCollectionRef = collection(productRef, "parts"); // Subcollection for parts

      await addDoc(partsCollectionRef, part); // Add part to Firestore

      alert("Parça başarıyla eklendi!");
      setPart({
        productCode: "",
        productName: "",
        partName: "",
        paketNo: "",
        cinsi: "",
        thickness: "",
        unitCount: "",
        totalCount: "",
        materialColor: "",
        macmazzeNet: { macmazzeLenght: "", macmazzeWidth: "" },
        pvcColor: "",
        edgeBanding: { eBanding: false },
        drilling: { sevenKafa: false },
        channel: { length: "", width: "" },
        partSize: { length: "", width: "" },
        notes: "",
      });
    } catch (error) {
      console.error("Parça eklenirken hata oluştu: ", error);
      alert("Parça eklenirken hata oluştu!");
    }
  };

  return (
    <Card className="p-3 mt-4">
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Ürün Seç</Form.Label>
              <Form.Control
                as="select"
                onChange={handleProductChange}
                value={part.productCode}
                required
              >
                <option value="">Ürün Seç</option>
                {products.map((product) => (
                  <option key={product.code} value={product.code}>
                    {product.code + " - " + product.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Parça Adı</Form.Label>
              <Form.Control
                type="text"
                name="partName"
                value={part.partName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Paket Nosu</Form.Label>
              <Form.Control
                type="text"
                name="paketNo"
                value={part.paketNo}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Cinsi</Form.Label>
              <Form.Control
                type="text"
                name="cinsi"
                value={part.cinsi}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Kalınlık</Form.Label>
              <Form.Control
                type="text"
                name="thickness"
                value={part.thickness}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Birim Adet:</Form.Label>
              <Form.Control
                type="text"
                name="unitCount"
                value={part.unitCount}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Renk</Form.Label>
              <Form.Control
                type="text"
                name="materialColor"
                value={part.materialColor}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Macmazze Net</Form.Label>
              <br />
              <Form.Label>Lenght:</Form.Label>
              <Form.Control
                type="text"
                name="macmazzeLenght"
                value={part.macmazzeNet.macmazzeLenght}
                onChange={(e) => handleNestedChange(e, "macmazzeNet")}
              />
              <Form.Label>Width:</Form.Label>
              <Form.Control
                type="text"
                name="macmazzeWidth"
                value={part.macmazzeNet.macmazzeWidth}
                onChange={(e) => handleNestedChange(e, "macmazzeNet")}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>PVC Rengi</Form.Label>
              <Form.Control
                type="text"
                name="pvcColor"
                value={part.pvcColor}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Check
                type="checkbox"
                label="Edge Banding"
                name="eBanding"
                checked={part.edgeBanding.eBanding}
                onChange={(e) =>
                  setPart((prev) => ({
                    ...prev,
                    edgeBanding: { eBanding: e.target.checked },
                  }))
                }
              />
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit" className="mt-3">
          Parça Ekle
        </Button>
      </Form>
    </Card>
  );
};

export default AddPartForm;
