import { createContext, useState } from "react";

export const LotContext = createContext();

export const LotProvider = ({ children }) => {
  // Lot eklemek için fonksiyon
  const addLot = (formData) => {
    const newLot = {
      lotNumber: formData.lotNumber,
      productCode: formData.productCode,
      productName: formData.productName,
      quantity: formData.quantity,
      status: formData.status,
    };

    setLots((prevLots) => [...prevLots, newLot]);
  };

  function addPart(part, productCode) {
    setProducts((prevProducts) => {
      return prevProducts.map((product) => {
        if (product.code === productCode) {
          return {
            ...product,
            parts: [...(product.parts || []), part],
          };
        }
        return product;
      });
    });
  }
  const [lots, setLots] = useState([
    // Mevcut iş emirlerini burada tutabiliriz
  ]);

  const [products, setProducts] = useState([
    { code: "SM 201", name: "2 Kapaklı Gardırop Gövde Atlantik" },
    { code: "SM 202", name: "2 Kapaklı Gardırop Gövde Beyaz" },
    { code: "SM 203", name: "2 Kapaklı Gardırop Kapak Atlantik" },
    { code: "SM 204", name: "2 Kapaklı Gardırop Kapak Beyaz" },
    { code: "SM 205", name: "2 Kapaklı Gardırop Kapak Antrasit" },

    { code: "SM 301", name: "3 Kapaklı Gardırop Gövde Atlantik" },
    { code: "SM 302", name: "3 Kapaklı Gardırop Gövde Beyaz" },
    { code: "SM 303", name: "3 Kapaklı Gardırop Kapak Atlantik" },
    { code: "SM 304", name: "3 Kapaklı Gardırop Kapak Beyaz" },
    { code: "SM 305", name: "3 Kapaklı Gardırop Kapak Antrasit" },

    { code: "SM 401", name: "4 Kapaklı Gardırop Gövde Atlantik" },
    { code: "SM 402", name: "4 Kapaklı Gardırop Gövde Beyaz" },
    { code: "SM 403", name: "4 Kapaklı Gardırop Kapak Atlantik" },
    { code: "SM 404", name: "4 Kapaklı Gardırop Kapak Beyaz" },
    { code: "SM 405", name: "4 Kapaklı Gardırop Kapak Antrasit" },
    { code: "152.01.0000141", name: "İKİ KAPILI KİLER ATLANTİK-BEYAZ" },
    { code: "152.01.0000143", name: "İKİ KAPILI KİLER ATLANTİK" },
    { code: "152.01.0000142", name: "İKİ KAPILI KİLER BEYAZ" },
    { code: "152.01.0000155", name: "TEK KAPILI KİLER ATLANTİK" },
    { code: "152.01.0000153", name: "TEK KAPILI KİLER ATLANTİK-BEYAZ" },
    { code: "152.01.0000154", name: "TEK KAPILI KİLER BEYAZ" },
    { code: "152.01.0000149", name: "KISA KİLER ATLANTİK" },
    { code: "152.01.0000147", name: "KISA KİLER ATLANTİK-BEYAZ" },
    { code: "152.01.0000148", name: "KISA KİLER BEYAZ" },
    { code: "152.01.0000581", name: "ALBA PORTMANTO ATLANTİK-BEYAZ" },
    { code: "152.01.0000576", name: "SERRA PORTMANTO ATLANTİK-BEYAZ" },
    { code: "152.01.0000592", name: "MAYA PORTMANTO ATLANTİK-BEYAZ" },
    { code: "152.01.0000591", name: "MAYA PORTMANTO BEYAZ" },
    { code: "152.01.0000542", name: "1225 PORTMANTO ATLANTİK" },
    { code: "152.01.0000543", name: "1250 PORTMANTO ATLANTİK" },
    { code: "152.01.0000593", name: "KEMER PORTMANTO ATLANTİK -BEYAZ" },
    { code: "152.01.0000630", name: "A-53 AYAKKABILIK ATLANTİK - BEYAZ" },
    { code: "152.01.0000634", name: "A-54 AYAKKABILIK ATLANTİK - BEYAZ" },
    { code: "152.01.0000642", name: "A-57 AYAKKABILIK ATLANTİK - BEYAZ" },

    { code: "151.02.0000001", name: "DEMONTE DOLAP" },
    { code: "151.02.0000002", name: "DEMONTE DOLAP" },
    { code: "151.02.0000003", name: "DEMONTE DOLAP" },
    { code: "151.02.0000004", name: "DEMONTE DOLAP" },
    { code: "151.02.0000005", name: "DEMONTE DOLAP" },
    { code: "151.02.0000006", name: "DEMONTE DOLAP" },
    { code: "151.02.0000007", name: "DEMONTE DOLAP" },
    { code: "151.02.0000008", name: "DEMONTE DOLAP" },
    { code: "151.02.0000009", name: "DEMONTE DOLAP" },
    { code: "151.02.0000010", name: "DEMONTE DOLAP" },
    { code: "151.02.0000011", name: "DEMONTE DOLAP" },
    { code: "151.02.0000012", name: "DEMONTE DOLAP" },
    { code: "151.02.0000013", name: "DEMONTE DOLAP" },
    { code: "151.02.0000014", name: "DEMONTE DOLAP" },
    { code: "151.02.0000015", name: "DEMONTE DOLAP" },
    { code: "151.02.0000016", name: "DEMONTE DOLAP" },
    { code: "151.02.0000017", name: "DEMONTE DOLAP" },
    { code: "151.02.0000018", name: "DEMONTE DOLAP" },
    { code: "151.02.0000019", name: "DEMONTE DOLAP" },
    { code: "151.02.0000020", name: "DEMONTE DOLAP" },
    { code: "151.02.0000021", name: "DEMONTE DOLAP" },
    { code: "151.02.0000022", name: "DEMONTE DOLAP" },
    { code: "151.02.0000023", name: "DEMONTE DOLAP" },
    { code: "151.02.0000024", name: "DEMONTE DOLAP" },
    { code: "151.02.0000025", name: "DEMONTE DOLAP" },
    { code: "151.02.0000026", name: "DEMONTE DOLAP" },
    { code: "151.02.0000027", name: "DEMONTE DOLAP" },
    { code: "151.02.0000028", name: "DEMONTE DOLAP" },
    { code: "151.02.0000029", name: "DEMONTE DOLAP" },
    { code: "151.02.0000030", name: "DEMONTE DOLAP" },
    { code: "151.02.0000031", name: "DEMONTE DOLAP" },
    { code: "151.02.0000032", name: "DEMONTE DOLAP" },
    { code: "151.02.0000033", name: "DEMONTE DOLAP" },
    { code: "151.02.0000034", name: "DEMONTE DOLAP" },
    { code: "151.02.0000035", name: "DEMONTE DOLAP" },
    { code: "151.02.0000036", name: "DEMONTE DOLAP" },
    { code: "151.02.0000037", name: "DEMONTE DOLAP" },
    { code: "151.02.0000038", name: "DEMONTE DOLAP" },
    { code: "151.02.0000039", name: "DEMONTE DOLAP" },
    { code: "151.02.0000040", name: "DEMONTE DOLAP" },
    { code: "151.02.0000041", name: "DEMONTE DOLAP" },
    { code: "151.02.0000042", name: "DEMONTE DOLAP" },
    { code: "151.02.0000043", name: "DEMONTE DOLAP" },
    { code: "151.02.0000044", name: "DEMONTE DOLAP" },
    { code: "151.02.0000045", name: "DEMONTE DOLAP" },
    { code: "151.02.0000046", name: "DEMONTE DOLAP" },
    { code: "151.02.0000047", name: "DEMONTE DOLAP" },
    { code: "151.02.0000048", name: "DEMONTE DOLAP" },
    { code: "151.02.0000049", name: "DEMONTE DOLAP" },
    { code: "151.02.0000050", name: "DEMONTE DOLAP" },
    { code: "151.02.0000051", name: "DEMONTE DOLAP" },
    { code: "151.02.0000052", name: "DEMONTE DOLAP" },
    { code: "151.02.0000053", name: "DEMONTE DOLAP" },
    { code: "151.02.0000054", name: "DEMONTE DOLAP" },
    { code: "151.02.0000055", name: "DEMONTE DOLAP" },
    { code: "151.02.0000056", name: "DEMONTE DOLAP" },
    { code: "151.02.0000057", name: "DEMONTE DOLAP" },
    { code: "151.02.0000058", name: "DEMONTE DOLAP" },
    { code: "151.02.0000059", name: "DEMONTE DOLAP" },
    { code: "151.02.0000060", name: "DEMONTE DOLAP" },
    { code: "151.02.0000061", name: "DEMONTE DOLAP" },
    { code: "151.02.0000062", name: "DEMONTE DOLAP" },
    { code: "151.02.0000063", name: "DEMONTE DOLAP" },
    { code: "151.02.0000064", name: "DEMONTE DOLAP" },
    { code: "151.02.0000065", name: "DEMONTE DOLAP" },
    { code: "151.02.0000066", name: "DEMONTE DOLAP" },
  ]);

  // Product eklemek için fonksiyon
  const addProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  return (
    <LotContext.Provider
      value={{
        lots,
        setLots,
        addLot,
        addPart,
        products,
        setProducts,
        addProduct,
      }}
    >
      {children}
    </LotContext.Provider>
  );
};
