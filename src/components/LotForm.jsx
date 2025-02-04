import { useState, useEffect, useContext } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { LotContext } from "../context/LotContext";

function LotForm() {
   localStorage.clear();
    const { addLot,products } = useContext(LotContext);  // LotContext'ten addLot fonksiyonunu alıyoruz

    // Ürün listesi
    
    const [formData, setFormData] = useState({
        productCode: '', // Ürün kodunu state'leyeceğiz
        productName: '',
        quantity: '',
        status: 'Üretimde',
        lotNumber: 1
    });

    // LocalStorage'dan mevcut lot numarasını al
    useEffect(() => {
        const storedLotNumber = localStorage.getItem('lotNumber');
        if (storedLotNumber) {
            setFormData(prevData => ({
                ...prevData,
                lotNumber: parseInt(storedLotNumber)
            }));
        }
    }, []);

    // Yeni lot eklerken
    const handleSubmit = (e) => {
        e.preventDefault();

        // Yeni lot numarasını güncelle ve sakla
        const newLotNumber = formData.lotNumber + 1;
        localStorage.setItem('lotNumber', newLotNumber);

        // Yeni lotu oluştur
        const newLot = {
            lotNumber: formData.lotNumber,
            productCode: formData.productCode, // Ürün kodunu da ekliyoruz
            productName: formData.productName,
            quantity: formData.quantity,
            status: formData.status
        };

        // Yeni lotu context'e ekle
        addLot(newLot);

        // Form verilerini sıfırla
        setFormData({
            productCode: '', // Ürün kodunu sıfırlıyoruz
            productName: '',
            quantity: '',
            status: 'Üretimde',
            lotNumber: newLotNumber
        });
    };

    // Ürün kodu değiştiğinde ürün adını otomatik olarak güncelle
    const handleProductCodeChange = (e) => {
        const selectedCode = e.target.value;
        const selectedProduct = products.find(product => product.code === selectedCode);

        setFormData(prevData => ({
            ...prevData,
            productCode: selectedCode,
            productName: selectedProduct ? selectedProduct.name : '' // Ürün adı boşsa sıfırlanır
        }));
    };


    
    // Form elemanlarının her birinin onChange'ini tek bir fonksiyon ile hallediyoruz
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <Container className="mt-5">
            <h2 className="mb-4">İş Emri Ekle</h2>
            <Row className="justify-content-center">
                <Col md={6} sm={8} xs={10}>
                    <Form onSubmit={handleSubmit}>
                        {/* Ürün Kodu Seçimi (Dropdown) */}
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
                                        {product.code}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>

                        {/* Ürün Adı Seçimi (Bu, ürün kodu seçildikten sonra otomatik gelir) */}
                        <Form.Group className="mb-3" controlId="formProductName">
                            <Form.Label>Ürün Adı</Form.Label>
                            <Form.Control 
                                type="text" 
                                name="productName"
                                value={formData.productName} 
                                disabled // Bu alan sadece görüntüleme amaçlı olacak
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

                        <Button variant="primary" type="submit">İş Emri Ekle</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default LotForm;
