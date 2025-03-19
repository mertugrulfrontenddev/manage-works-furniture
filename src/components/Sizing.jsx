import React, { useContext, useState, useEffect } from "react";
import { Form, Row, Col, Container, FormGroup, Button } from "react-bootstrap";
import { LotContext } from "../context/LotContext";
import { collection, addDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Sizing = () => {
  const { products } = useContext(LotContext);
  const [productsWithSizes, setProductsWithSizes] = useState([]);

  const fetchSizes = async () => {
    try {
      const sizePromises = products.map(async (product) => {
        const productRef = doc(db, "products", product.code);
        const sizeCollectionRef = collection(productRef, "size");
        const sizeSnapshot = await getDocs(sizeCollectionRef);

        const sizes = sizeSnapshot.docs.map((doc) => doc.data());

        return {
          ...product,
          sizes: sizes.length > 0 ? sizes : null,
        };
      });

      const updatedProducts = await Promise.all(sizePromises);
      const filteredProducts = updatedProducts.filter(
        (product) => product.sizes !== null
      );

      setProductsWithSizes(filteredProducts);
    } catch (error) {
      console.error("❌ Error fetching sizes:", error);
    }
  };

  useEffect(() => {
    fetchSizes();
  }, [products]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productRef = doc(db, "products", dataForm.productCode);
      const sizeCollectionRef = collection(productRef, "size");

      await addDoc(sizeCollectionRef, dataForm);
      alert("Ebat başarıyla eklendi!");

      fetchSizes();

      setDataForm({
        productCode: "",
        productName: "",
        plakaTanim: "",
        lotAdet: "",
        plakaAdeti: "",
        plakaOlcu: "",
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
    plakaAdeti: "",
    plakaOlcu: "",
  });

  const handlePlakaChange = (e) => {
    const selectedPlaka = e.target.value;
    setDataForm((prevData) => ({ ...prevData, plakaTanim: selectedPlaka }));
  };

  const handlePlakaOlcuChange = (e) => {
    const value = e.target.value;
    setDataForm((prevData) => ({ ...prevData, plakaOlcu: value }));
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
        <Col md={11}>
          <h3>Ürünler ve Boyutları</h3>
          <div className="table-container">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Ürün Kodu</th>
                  <th>Ürün Adı</th>

                  <th>Plaka Tanım</th>
                  <th>Plaka Adeti</th>
                </tr>
              </thead>
              <tbody>
                {productsWithSizes.map((product) =>
                  product.sizes.length > 0 ? (
                    product.sizes.map((size, index) => (
                      <tr key={index}>
                        <td>{product.code}</td>
                        <td>{product.name}</td>

                        <td>{size.plakaTanim}</td>
                        <td>{size.plakaAdeti}</td>
                      </tr>
                    ))
                  ) : (
                    <tr key={product.code}>
                      <td colSpan="4">Boyut bilgisi yok</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </Col>
      </Row>

      <div className="form-container">
        <Form onSubmit={handleSubmit}>
          <Form.Label className="fw-bold fs-3 mt-1">Ebatlama Ekleme</Form.Label>

          <FormGroup>
            <Form.Label>Ürün Kodu:</Form.Label>
            <Form.Control
              as={"select"}
              name="productCode"
              value={dataForm.productCode}
              onChange={handleProductCodeChange}
              required
            >
              <option value="">Seçiniz</option>
              {products.map((product) => (
                <option key={product.code} value={product.code}>
                  {product.code + "-" + product.name}
                </option>
              ))}
            </Form.Control>
          </FormGroup>

          <FormGroup>
            <Form.Label>Ürün Adı:</Form.Label>
            <Form.Control as={"input"} disabled value={dataForm.productName} />
          </FormGroup>

          <FormGroup>
            <Form.Label>Plaka Tanımı:</Form.Label>
            <Form.Control
              as={"select"}
              name="plakaTanim"
              value={dataForm.plakaTanim}
              onChange={handlePlakaChange}
              required
            >
              <option value="">Seçiniz</option>
              <option value="18 MM ATLANTİK ÇAM">18 MM ATLANTİK ÇAM</option>
              <option value="18 MM BEYAZ">18 MM BEYAZ</option>
              <option value="18 MM PARLAK BEYAZ">18 MM PARLAK BEYAZ</option>
              <option value="18 MM MİLAS CEVİZ">18 MM MİLAS CEVİZ</option>
              <option value="18 MM AKÇA AĞAÇ">18 MM AKÇA AĞAÇ</option>
              <option value="18 MM BAROK CEVİZ">18 MM BAROK CEVİZ</option>
              <option value="18 MM WOOD BEYAZ">18 MM WOOD BEYAZ</option>
              <option value="18 MM TEK YÜZ MDF">18 MM TEK YÜZ MDF</option>
              <option value="8 MM BEYAZ">8 MM BEYAZ</option>
              <option value="2,7 MM MDF ARKALIK">2,7 MM MDF ARKALIK</option>
            </Form.Control>
          </FormGroup>

          <FormGroup>
            <Form.Label>Plaka Ölçüsü:</Form.Label>
            <Form.Control
              as={"select"}
              name="olcu"
              value={dataForm.plakaOlcu}
              onChange={handlePlakaOlcuChange}
              required
            >
              <option value="">Seçiniz</option>
              <option value="3660*1830">3660*1830</option>
              <option value="2100*1700">2100*1700</option>
              <option value="2800*2100">2800*2100</option>
            </Form.Control>
          </FormGroup>

          <FormGroup>
            <Form.Label>Lot Adeti:</Form.Label>
            <Form.Control
              as={"select"}
              name="lotAdet"
              value={dataForm.lotAdet}
              onChange={handleLotAdetChange}
              required
            >
              <option value="">Seçiniz</option>
              <option value="100">100</option>
              <option value="200">200</option>
              <option value="300">300</option>
            </Form.Control>
          </FormGroup>

          <FormGroup>
            <Form.Label>Plaka Adeti:</Form.Label>
            <Form.Control
              as={"input"}
              name="plakaAdeti"
              value={dataForm.plakaAdeti}
              onChange={handlePlakaAdetiChange}
              type="number"
              min="0"
              placeholder="Plaka adeti giriniz"
              required
            />
          </FormGroup>

          <Button variant="primary" className="mt-1" type="submit">
            Ekle
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Sizing;
