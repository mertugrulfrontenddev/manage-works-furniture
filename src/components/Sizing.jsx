import React, { useContext, useState } from "react";
import { Form, Row, Col, Container, FormGroup, Button } from "react-bootstrap";
import { LotContext } from "../context/LotContext";

import { collection, addDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
const Sizing = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productRef = doc(db, "products", dataForm.productCode);

      const sizeCollectionRef = collection(productRef, "size");
      await addDoc(sizeCollectionRef, dataForm);
      alert("Ebat başarıyla eklendi!");
      setDataForm({
        productCode: "",
        productName: "",
        plakaTanim: "",
        lotAdet: "",
        plakaAdeti: "",
      });
    } catch (error) {
      console.error("Error adding document:", error);
    }
  };

  const [dataForm, setDataForm] = useState({
    productCode: "",
    productName: "",
    plakaTanim: "",
    lotAdet: "",
    plakaAdeti: "", // plaka adeti kullanıcı tarafından girilecek
  });

  const { products } = useContext(LotContext);

  const handlePlakaChange = (e) => {
    const selectedPlaka = e.target.value;
    setDataForm((prevData) => ({ ...prevData, plakaTanim: selectedPlaka }));
  };

  const handleLotAdetChange = (e) => {
    const selectedLotAdet = e.target.value;
    setDataForm((prevData) => ({
      ...prevData,
      lotAdet: selectedLotAdet,
    }));
  };

  const handlePlakaAdetiChange = (e) => {
    const plakaAdeti = e.target.value;
    setDataForm((prevData) => ({
      ...prevData,
      plakaAdeti: plakaAdeti,
    }));
  };

  const handleProductCodeChange = (e) => {
    const selectedCode = e.target.value;
    const selectedProduct = products.find(
      (product) => product.code === selectedCode
    );

    setDataForm((prevData) => ({
      ...prevData,
      productCode: selectedCode,
      productName: selectedProduct ? selectedProduct.name : "",
    }));
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={6} sm={8} xs={10}>
          <Form onSubmit={handleSubmit}>
            <Form.Label className="fw-bold fs-3 mt-3">
              Ebatlama Ekleme Sayfası
            </Form.Label>

            {/* Ürün Kodu Seçimi */}
            <FormGroup>
              <Form.Label>Ürün Kodu:</Form.Label>
              <Form.Control
                as={"select"}
                name="productCode"
                value={dataForm.productCode}
                onChange={handleProductCodeChange}
                required // Zorunlu alan
              >
                <option value="">Seçiniz</option>
                {products.map((product) => (
                  <option key={product.code} value={product.code}>
                    {product.code + "-" + product.name}
                  </option>
                ))}
              </Form.Control>
            </FormGroup>

            {/* Ürün Adı (Otomatik olarak güncelleniyor) */}
            <FormGroup>
              <Form.Label>Ürün Adı:</Form.Label>
              <Form.Control
                as={"input"}
                disabled
                value={dataForm.productName}
              />
            </FormGroup>

            {/* Plaka Tanımı Seçimi */}
            <FormGroup>
              <Form.Label>Plaka Tanımı:</Form.Label>
              <Form.Control
                as={"select"}
                name="plakaTanim"
                value={dataForm.plakaTanim}
                onChange={handlePlakaChange}
                required // Zorunlu alan
              >
                <option value="">Seçiniz</option>
                <option value="18 MM 3660*1830 ATLANTİK ÇAM SUNTALAM">
                  18 MM 3660*1830 ATLANTİK ÇAM SUNTALAM
                </option>
                <option value="18 MM 3660*1830 BEYAZ">
                  18 MM 3660*1830 BEYAZ
                </option>
                <option value="18 MM 3660*1830 PARLAK BEYAZ">
                  18 MM 3660*1830 PARLAK BEYAZ
                </option>
                <option value="2,7 MM 2100*1700 TY BEYAZ MDF">
                  2,7 MM 2100*1700 TY BEYAZ MDF
                </option>
              </Form.Control>
            </FormGroup>

            {/* Lot Adeti Seçimi */}
            <FormGroup>
              <Form.Label>Lot Adeti:</Form.Label>
              <Form.Control
                as={"select"}
                name="lotAdet"
                value={dataForm.lotAdet}
                onChange={handleLotAdetChange}
                required // Zorunlu alan
              >
                <option value="">Seçiniz</option>
                <option value="100">100</option>
                <option value="200">200</option>
                <option value="300">300</option>
              </Form.Control>
            </FormGroup>

            {/* Plaka Adeti Girişi */}
            <FormGroup>
              <Form.Label>Plaka Adeti:</Form.Label>
              <Form.Control
                as={"input"}
                name="plakaAdeti"
                value={dataForm.plakaAdeti}
                onChange={handlePlakaAdetiChange}
                type="number" // Sayısal giriş
                min="0" // Negatif sayı girmeyi engeller
                placeholder="Plaka adeti giriniz"
                required // Zorunlu alan
              />
            </FormGroup>

            {/* Kaydetme Butonu */}
            <Button variant="primary" className="mt-5" type="submit">
              Ekle
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Sizing;
