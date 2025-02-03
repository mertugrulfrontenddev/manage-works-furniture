import { useState, useEffect, useContext } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { LotContext } from "../context/LotContext";

function LotForm() {
  /*   localStorage.clear(); */
    const { addLot } = useContext(LotContext);  // LotContext'ten addLot fonksiyonunu alıyoruz

    // Ürün listesi
    const productList = [
        { code: '152.01.0000141', name: 'İKİ KAPILI KİLER ATLANTİK-BEYAZ' },
        { code: '152.01.0000143', name: 'İKİ KAPILI KİLER ATLANTİK' },
        { code: '152.01.0000142', name: 'İKİ KAPILI KİLER BEYAZ' },
        { code: '152.01.0000155', name: 'TEK KAPILI KİLER ATLANTİK' },
        { code: '152.01.0000153', name: 'TEK KAPILI KİLER ATLANTİK-BEYAZ' },
        { code: '152.01.0000154', name: 'TEK KAPILI KİLER BEYAZ' },
        { code: '152.01.0000149', name: 'KISA KİLER ATLANTİK' },
        { code: '152.01.0000147', name: 'KISA KİLER ATLANTİK-BEYAZ' },
        { code: '152.01.0000148', name: 'KISA KİLER BEYAZ' },
        { code: '152.01.0000581', name: 'ALBA PORTMANTO ATLANTİK-BEYAZ' },
        { code: '152.01.0000576', name: 'SERRA PORTMANTO ATLANTİK-BEYAZ' },
        { code: '152.01.0000592', name: 'MAYA PORTMANTO ATLANTİK-BEYAZ' },
        { code: '152.01.0000591', name: 'MAYA PORTMANTO BEYAZ' },
        { code: '152.01.0000542', name: '1225 PORTMANTO ATLANTİK' },
        { code: '152.01.0000543', name: '1250 PORTMANTO ATLANTİK' },
        { code: '152.01.0000593', name: 'KEMER PORTMANTO ATLANTİK -BEYAZ' },
        { code: '152.01.0000630', name: 'A-53 AYAKKABILIK ATLANTİK - BEYAZ' },
        { code: '152.01.0000634', name: 'A-54 AYAKKABILIK ATLANTİK - BEYAZ' },
        { code: '152.01.0000642', name: 'A-57 AYAKKABILIK ATLANTİK - BEYAZ' },
        { code: '151.01.0000001', name: 'S 181-183 BEYAZ GÖVDE' },
        { code: '151.01.0000002', name: 'S 182-184 BEYAZ GÖVDE' },
        { code: '151.01.0000003', name: 'S 185-186 BEYAZ GÖVDE' },
        { code: '151.01.0000004', name: 'S 187-188 BEYAZ GÖVDE' },
        { code: '151.01.0000005', name: 'S 172-174 BEYAZ GÖVDE' },
        { code: '151.01.0000006', name: 'S 152-154 BEYAZ GÖVDE' },
        { code: '151.01.0000007', name: 'S 060 ÇOK AMAÇLI DOLAP' },
        { code: '151.01.0000008', name: 'S 092 ÇOK AMAÇLI DOLAP' },
        { code: '151.01.0000009', name: 'S 1012 BEYAZ GÖVDE' },
        { code: '151.01.0000010', name: 'P 1012 AKÇA GÖVDE' },
        { code: '151.01.0000011', name: 'P 1012 CEVİZ GÖVDE' },
        { code: '151.01.0000012', name: 'P 1082-1084 AKÇA GÖVDE' },
        { code: '151.01.0000013', name: 'P 1082-1084 CEVİZ GÖVDE' },
        { code: '151.01.0000014', name: 'S 181 BEYAZ KAPAK' },
        { code: '151.01.0000015', name: 'S 182 BEYAZ KAPAK' },
        { code: '151.01.0000016', name: 'S 183 BEYAZ KAPAK' },
        { code: '151.01.0000017', name: 'S 184 BEYAZ KAPAK' },
        { code: '151.01.0000018', name: 'S 185 BEYAZ KAPAK' },
        { code: '151.01.0000019', name: 'S 186 BEYAZ KAPAK' },
        { code: '151.01.0000020', name: 'S 187 BEYAZ KAPAK' },
        { code: '151.01.0000021', name: 'S 188 BEYAZ KAPAK' },
        { code: '151.01.0000022', name: 'S 172 BEYAZ KAPAK' },
        { code: '151.01.0000023', name: 'S 174 BEYAZ KAPAK' },
        { code: '151.01.0000024', name: 'S 152 BEYAZ KAPAK' },
        { code: '151.01.0000025', name: 'S 154 BEYAZ KAPAK' },
        { code: '151.01.0000026', name: 'S 1012 BEYAZ KAPAK' },
        { code: '151.01.0000027', name: 'P 1012 AKÇA KAPAK' },
        { code: '151.01.0000028', name: 'P 1012 CEVİZ KAPAK' },
        { code: '151.01.0000029', name: 'P 1082 AKÇA KAPAK' },
        { code: '151.01.0000030', name: 'P 1082 CEVİZ KAPAK' },
        { code: '151.01.0000031', name: 'P 1084 AKÇA KAPAK' },
        { code: '151.01.0000032', name: 'P 1084 CEVİZ KAPAK' }
    ];
    

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
        const selectedProduct = productList.find(product => product.code === selectedCode);

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
            <h2 className="mb-4">Yeni Lot Ekle</h2>
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
                                {productList.map((product) => (
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

                        <Button variant="primary" type="submit">Lot Ekle</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default LotForm;
