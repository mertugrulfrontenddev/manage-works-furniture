import { useState, useContext } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { LotContext } from "../context/LotContext";
import { db } from "../firebase"; // Firestore importu
import { doc, collection, addDoc } from "firebase/firestore";
import LoadingSpinner from "./LoadingSpinner";

const AddPartForm = () => {
  const { products } = useContext(LotContext);

  const [loading, setLoading] = useState(false);
  const [part, setPart] = useState({
    partCode: "",
    productCode: "",
    productName: "",
    partName: "",
    paketNo: "",
    cinsi: "",
    thickness: "",
    unitCount: "",

    materialColor: "",
    macmazzeNet: {
      macmazzeLenght: "",
      macmazzeWidth: "",
    },
    pvcColor: "",
    banding: "", // Bantlama türü
    edgeBanding: {
      en1: "",
      en2: "",
      boy1: "",
      boy2: "",
    },
    drilling: "",
    channel: "",
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

  const handleEdgeBandingChange = (e) => {
    const { name, value } = e.target;
    setPart((prev) => ({
      ...prev,
      edgeBanding: { ...prev.edgeBanding, [name]: value },
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
    setLoading(true);
    if (!part.productCode) {
      alert("Lütfen bir ürün seçin.");
      return;
    }

    try {
      const productRef = doc(db, "products", part.productCode); // Ürün dokümanı referansı
      const partsCollectionRef = collection(productRef, "parts"); // Parçalar için alt koleksiyon

      await addDoc(partsCollectionRef, part); // Part'ı Firestore'a ekle

      setPart({
        partCode: "",
        productCode: "",
        productName: "",
        partName: "",
        paketNo: "",
        cinsi: "",
        thickness: "",
        unitCount: "",
        materialColor: "",
        macmazzeNet: { macmazzeLenght: "", macmazzeWidth: "" },
        pvcColor: "",
        banding: "",
        edgeBanding: {
          en1: "",
          en2: "",
          boy1: "",
          boy2: "",
        },
        drilling: "",
        channel: "",
        partSize: { length: "", width: "" },
        notes: "",
      });
    } catch (error) {
      console.error("Parça eklenirken hata oluştu: ", error);
      alert("Parça eklenirken hata oluştu!");
    } finally {
      setLoading(false);

      setTimeout(() => {
        alert("Parça başarıyla eklendi!"); // Veritabanı işlemi başarılı olursa alert göster
      }, 100); // 100ms sonra alerti göster
    }
  };

  return (
    <Card className="p-3 mt-4">
      {loading ? (
        <LoadingSpinner />
      ) : (
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
            <Col md={6}>
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
                <Form.Label>Parça Kodu:</Form.Label>
                <Form.Control
                  type="text"
                  name="partCode"
                  value={part.partCode}
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
                  as="select"
                  name="cinsi"
                  value={part.cinsi}
                  onChange={handleChange}
                  required
                >
                  <option value="">Paket No Seçiniz</option>
                  <option value="Suntalam">Suntalam</option>
                  <option value="MDF">MDF</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Kalınlık)</Form.Label>
                <Form.Control
                  as="select"
                  name="thickness"
                  value={part.thickness}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="3">3</option>
                  <option value="8">8</option>
                  <option value="12">12</option>
                  <option value="18">18</option>
                </Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>Birim Adedi</Form.Label>
                <Form.Control
                  type="number"
                  name="unitCount"
                  value={part.unitCount}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Malzeme Rengi</Form.Label>
                <Form.Control
                  as="select"
                  name="materialColor"
                  value={part.materialColor}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="18 MM ATLANTİK ÇAM">
                    18 MM ATLANTİK ÇAM
                  </option>{" "}
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
              </Form.Group>

              <Form.Group>
                <Form.Label>Pvc Rengi</Form.Label>
                <Form.Control
                  as="select"
                  name="pvcColor"
                  value={part.pvcColor}
                  onChange={handleChange}
                  required
                >
                  <option value="">Pvc Rengi Seçiniz</option>
                  <option value="ATLANTİK ÇAM">ATLANTİK ÇAM</option>{" "}
                  <option value="BEYAZ">BEYAZ</option>
                  <option value=" MİLAS CEVİZ">MİLAS CEVİZ</option>
                  <option value="AKÇA AĞAÇ">AKÇA AĞAÇ</option>
                  <option value="BAROK CEVİZ">BAROK CEVİZ</option>
                  <option value="WOOD BEYAZ">WOOD BEYAZ</option>
                </Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>Macmazze Boyutları</Form.Label>
                <Row>
                  <Col>
                    <Form.Label>Boy</Form.Label>
                    <Form.Control
                      type="text"
                      name="macmazzeLenght"
                      value={part.macmazzeNet.macmazzeLenght}
                      onChange={(e) => handleNestedChange(e, "macmazzeNet")}
                      required
                    />
                  </Col>
                  <Col>
                    <Form.Label>En</Form.Label>
                    <Form.Control
                      type="text"
                      name="macmazzeWidth"
                      value={part.macmazzeNet.macmazzeWidth}
                      onChange={(e) => handleNestedChange(e, "macmazzeNet")}
                      required
                    />
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group>
                <Form.Label>Kanal Boyu</Form.Label>
                <Row>
                  <Col>
                    <Form.Control
                      as="select"
                      name="channel"
                      value={part.channel}
                      onChange={handleChange}
                    >
                      <option value="">Kanal Boyu Seçiniz</option>
                      <option value="Tam Kanal">Tam Kanal</option>
                      <option value="İki Kanal">İki Kanal</option>
                      <option value="Dal Kanal">Dal Kanal</option>
                    </Form.Control>
                  </Col>
                </Row>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Delik</Form.Label>
                <Form.Control
                  as="select"
                  name="drilling"
                  value={part.drilling}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="7kafa">7kafa</option>
                  <option value="Nanxing 1">Nanxing 1</option>
                  <option value="Nanxing 2">Nanxing 2</option>
                  <option value="Uniteam">Uniteam</option>
                  <option value="Delik Yok">Delik Yok</option>
                </Form.Control>
              </Form.Group>
              <Form.Group>
                <Form.Label>Bantlama</Form.Label>
                <Form.Control
                  as="select"
                  name="banding"
                  value={part.banding}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seçiniz</option>
                  <option value="K Bantlama">K Bantlama</option>
                  <option value="B Bantlama">B Bantlama</option>
                  <option value="E Kenar">E Kenar</option>
                  <option value="Bantlama Yok">Bantlama Yok</option>
                </Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>Kenar Bandı (Boy1)</Form.Label>
                <Form.Control
                  as="select"
                  name="boy1"
                  value={part.edgeBanding.boy1}
                  onChange={handleEdgeBandingChange}
                >
                  <option value="">Seçiniz</option>
                  <option value="0.4">0.4</option>
                  <option value="0.8">0.8</option>
                </Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>Kenar Bandı (Boy2)</Form.Label>
                <Form.Control
                  as="select"
                  name="boy2"
                  value={part.edgeBanding.boy2}
                  onChange={handleEdgeBandingChange}
                >
                  <option value="">Seçiniz</option>
                  <option value="0.4">0.4</option>
                  <option value="0.8">0.8</option>
                </Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>Kenar Bandı (En1)</Form.Label>
                <Form.Control
                  as="select"
                  name="en1"
                  value={part.edgeBanding.en1}
                  onChange={handleEdgeBandingChange}
                >
                  <option value="">Seçiniz</option>
                  <option value="0.4">0.4</option>
                  <option value="0.8">0.8</option>
                </Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>Kenar Bandı (En2)</Form.Label>
                <Form.Control
                  as="select"
                  name="en2"
                  value={part.edgeBanding.en2}
                  onChange={handleEdgeBandingChange}
                >
                  <option value="">Seçiniz</option>
                  <option value="0.4">0.4</option>
                  <option value="0.8">0.8</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Parça Boyutları</Form.Label>
                <Row>
                  <Col>
                    <Form.Label>Boy</Form.Label>
                    <Form.Control
                      type="text"
                      name="length"
                      value={part.partSize.length}
                      onChange={(e) => handleNestedChange(e, "partSize")}
                      required
                    />
                  </Col>
                  <Col>
                    <Form.Label>En</Form.Label>
                    <Form.Control
                      type="text"
                      name="width"
                      value={part.partSize.width}
                      onChange={(e) => handleNestedChange(e, "partSize")}
                      required
                    />
                  </Col>
                </Row>
              </Form.Group>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Notlar</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="notes"
                  value={part.notes}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Button variant="primary" type="submit" className="mt-3">
            Kaydet
          </Button>
        </Form>
      )}
    </Card>
  );
};

export default AddPartForm;
