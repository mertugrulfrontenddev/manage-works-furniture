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
    paketNo: "", // Now this is a select field
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
    edgeBanding: "", // Now this will store "K Bandlama", "B Bandlama", or "E Kenar"
    drilling: "", // Directly select drilling type (7kafa, Nanxing 1, Nanxing 2, Uniteam)
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
        edgeBanding: "",
        drilling: "", // Reset the drilling field as well
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
                as="select"
                name="paketNo"
                value={part.paketNo}
                onChange={handleChange}
                required
              >
                <option value="">Paket No Seçiniz</option>
                <option value="1/1">1/1</option>
                <option value="3/1">3/1</option>
                <option value="3/2">3/2</option>
                <option value="4/1">4/1</option>
                <option value="4/2">4/2</option>
                <option value="4/3">4/3</option>
                <option value="5/1">5/1</option>
                <option value="5/2">5/2</option>
                <option value="5/3">5/3</option>
                <option value="5/4">5/4</option>
              </Form.Control>
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
              <Form.Label>Boy:</Form.Label>
              <Form.Control
                type="text"
                name="macmazzeLenght"
                value={part.macmazzeNet.macmazzeLenght}
                onChange={(e) => handleNestedChange(e, "macmazzeNet")}
              />
              <Form.Label>Genişlik:</Form.Label>
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
              <Form.Label>Bantlama</Form.Label>
              <Form.Control
                as="select"
                name="edgeBanding"
                value={part.edgeBanding}
                onChange={handleChange}
              >
                <option value="">Seçiniz</option>
                <option value="K Bandlama">K Bandlama</option>
                <option value="B Bandlama">B Bandlama</option>
                <option value="E Kenar">E Kenar</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Delik</Form.Label>
              <Form.Control
                as="select"
                name="drilling"
                value={part.drilling}
                onChange={handleChange}
              >
                <option value="">Seçiniz</option>
                <option value="7kafa">7kafa</option>
                <option value="Nanxing 1">Nanxing 1</option>
                <option value="Nanxing 2">Nanxing 2</option>
                <option value="Uniteam">Uniteam</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>Kanal Boy:</Form.Label>
              <Form.Control
                type="text"
                name="length"
                value={part.channel.length}
                onChange={(e) => handleNestedChange(e, "channel")}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Kanal Genişlik</Form.Label>
              <Form.Control
                type="text"
                name="width"
                value={part.channel.width}
                onChange={(e) => handleNestedChange(e, "channel")}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label> Parça Ölçüsü</Form.Label> <br />
              <Form.Label> Boy</Form.Label>
              <Form.Control
                type="text"
                name="length"
                value={part.partSize.length}
                onChange={(e) => handleNestedChange(e, "partSize")}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Genişlik</Form.Label>
              <Form.Control
                type="text"
                name="width"
                value={part.partSize.width}
                onChange={(e) => handleNestedChange(e, "partSize")}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Açıklama</Form.Label>
              <Form.Control
                as="textarea"
                name="notes"
                value={part.notes}
                onChange={handleChange}
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
