import { useState, useEffect, useContext } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { db } from "../firebase"; // Firebase'den db import
import { collection, addDoc, getDocs, onSnapshot } from "firebase/firestore";
import { LotContext } from "../context/LotContext";

function LotForm() {
  const { addLot, products } = useContext(LotContext); // Context'ten addLot fonksiyonu

  const [formData, setFormData] = useState({
    productCode: "",
    productName: "",
    quantity: "",
    status: "Üretimde",
    lotNumber: 1,
  });

  const [lots, setLots] = useState([]); // Firebase'deki tüm lotları tutmak için state

  // Firebase'den en son lot numarasını al
  const getLastLotNumber = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "lots"));
      let maxLotNumber = 0; // Başlangıç değeri 0 olmalı, çünkü daha önce hiç veri yoksa sıfırdan başlamalı
      querySnapshot.forEach((doc) => {
        const lotData = doc.data();
        if (lotData.lotNumber > maxLotNumber) {
          maxLotNumber = lotData.lotNumber;
        }
      });
      return maxLotNumber;
    } catch (error) {
      console.error("Error getting documents: ", error);
      return 0; // Eğer hata oluşursa sıfır döndür
    }
  };

  // Sayfa yüklendiğinde lot numarasını kontrol et ve state'i güncelle
  const setInitialLotNumber = async () => {
    const lastLotNumber = await getLastLotNumber();
    const newLotNumber = lastLotNumber + 1; // Firebase'deki son numaradan 1 fazla
    setFormData((prevData) => ({
      ...prevData,
      lotNumber: newLotNumber, // Yeni lot numarasını state'e ekle
    }));
  };

  // Firebase'deki lotları dinle
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "lots"), (snapshot) => {
      const lotData = snapshot.docs.map((doc) => doc.data());
      setLots(lotData); // Firebase'deki tüm lot verilerini state'e güncelle
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  // Sayfa yüklendiğinde initial lot numarasını ayarlıyoruz
  useEffect(() => {
    setInitialLotNumber();
  }, []); // useEffect sadece bir kez çalışacak, çünkü [] dependenstları boş

  // Yeni lot eklerken
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Firebase'den mevcut lot numarasını al
    const lastLotNumber = await getLastLotNumber();
    const newLotNumber = lastLotNumber + 1; // Yeni lot numarasını artır

    // Yeni lot objesini oluştur
    const newLot = {
      lotNumber: newLotNumber,
      productCode: formData.productCode,
      productName: formData.productName,
      quantity: formData.quantity,
      status: formData.status,
    };

    // Yeni lotu Firebase'e kaydet
    try {
      await addDoc(collection(db, "lots"), newLot); // "lots" koleksiyonuna veri ekle
      console.log("New lot added with lotNumber: ", newLotNumber);
      setFormData({
        productCode: "",
        productName: "",
        quantity: "",
        status: "Üretimde",
        lotNumber: newLotNumber, // Yeni lot numarasını state'e güncelle
      });
      setInitialLotNumber(); // Ekleme sonrası güncel lot numarasını al
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  // Ürün kodu değiştiğinde ürün adını otomatik olarak güncelle
  const handleProductCodeChange = (e) => {
    const selectedCode = e.target.value;
    const selectedProduct = products.find(
      (product) => product.code === selectedCode
    );

    setFormData((prevData) => ({
      ...prevData,
      productCode: selectedCode,
      productName: selectedProduct ? selectedProduct.name : "",
    }));
  };

  // Form elemanlarının her birinin onChange'ini tek bir fonksiyon ile hallediyoruz
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">İş Emri Ekle</h2>
      <Row className="justify-content-center">
        <Col md={6} sm={8} xs={10}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formProductCode">
              <Form.Label>Ürün Kodu</Form.Label>
              <Form.Control
                as="select"
                name="productCode"
                value={formData.productCode}
                onChange={handleProductCodeChange}
              >
                <option value="">Ürün kodu seçin</option>
                {products.map((product) => (
                  <option key={product.code} value={product.code}>
                    {product.code + "-" + product.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formProductName">
              <Form.Label>Ürün Adı</Form.Label>
              <Form.Control
                type="text"
                name="productName"
                value={formData.productName}
                disabled
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formQuantity">
              <Form.Label>Adet</Form.Label>
              <Form.Control
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Adet girin"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formStatus">
              <Form.Label>Durum</Form.Label>
              <Form.Control
                type="text"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                placeholder="Durum girin"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formLotNumber">
              <Form.Label>Lot No</Form.Label>
              <Form.Control
                type="text"
                name="lotNumber"
                value={formData.lotNumber}
                disabled
                readOnly
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              İş Emri Ekle
            </Button>
          </Form>
        </Col>
      </Row>

      <div>
        <h3>Mevcut İş Emirleri</h3>
        <ul>
          {lots.map((lot, index) => (
            <li key={index}>
              Lot No: {lot.lotNumber} | Ürün Kodu: {lot.productCode} | Ürün Adı:{" "}
              {lot.productName} | Adet: {lot.quantity} | Durum: {lot.status}
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}

export default LotForm;
