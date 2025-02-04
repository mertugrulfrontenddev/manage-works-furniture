import { createContext, useState } from "react";

export const LotContext = createContext();

export const LotProvider = ({ children }) => {
  const [lots, setLots] = useState([
    // Mevcut iş emirlerini burada tutabiliriz
   
  ]);

  const [products, setProducts] = useState([
    {
      code: "152.01.0000141",
      name: "İKİ KAPILI KİLER ATLANTİK-BEYAZ",
      parts: [
        {
          partName: "SAĞ YAN",
          paketNo: "5/1",
          cinsi: "Suntalam",
          thickness: 18,
          unitCount: 1,
          totalCount: 0,
          materialColor: "Atlantik Çam",
          macmazzeNet: {
            length: 1811,
            width: 449,
          },
          pvcColor: "Atlantik Çam",
          edgeBanding: {
            eBanding: true,
            kBanding: false,
            bBanding: true,
          },
          channel: {
            length: "4 mm Tam Kanal",
            width: 0,
          },
          partSize: {
            length: 1811,
            width: 450,
          },
          drilling: {
            sevenKafa: true,
            nanxing1: false,
            nanxing2: true,
            niteam: false,
          },
          lotNumber: "LOT-001",
          notes: "Özel kesim",
        },{
          partName: "SOL YAN",
          paketNo: "5/1",
          cinsi: "Suntalam",
          thickness: 18,
          unitCount: 1,
          totalCount: 0,
          materialColor: "Atlantik Çam",
          macmazzeNet: {
            length: 1811,
            width: 449,
          },
          pvcColor: "Atlantik Çam",
          edgeBanding: {
            eBanding: true,
            kBanding: false,
            bBanding: true,
          },
          channel: {
            length: "4mm Tam Kanal",
            width: 0,
          },
          partSize: {
            length: 1811,
            width: 450,
          },
          drilling: {
            sevenKafa: true,
            nanxing1: false,
            nanxing2: true,
            niteam: false,
          },
          lotNumber: "LOT-001",
          notes: "-",
        },{
          partName: "ARKALIK",
          paketNo: "5/1",
          cinsi: "TY MDF",
          thickness: 3,
          unitCount: 2,
          totalCount: 0,
          materialColor: "Beyaz",
          macmazzeNet: {
            length: 1739,
            width: 417.5,
          },
          pvcColor: "Beyaz",
          edgeBanding: {
            eBanding: true,
            kBanding: false,
            bBanding: true,
          },
          channel: {
            length: "",
            width: "",
          },
          partSize: {
            length: 1739,
            width: 835,
          },
          drilling: {
            sevenKafa: true,
            nanxing1: false,
            nanxing2: true,
            niteam: false,
          },
          lotNumber: "LOT-001",
          notes: "-",
        },{
          partName: "ÜST TABLA",
          paketNo: "5/2",
          cinsi: "SUNTALAM",
          thickness: 18,
          unitCount: 1,
          totalCount: 0,
          materialColor: "Beyaz",
          macmazzeNet: {
            length: 860.4,
            width: 467.4,
          },
          pvcColor: "ATLANTİK ÇAM",
          edgeBanding: {
            eBanding: true,
            kBanding: false,
            bBanding: true,
          },
          channel: {
            length: "4mm TAM KANAL",
            width: "-",
          },
          partSize: {
            length: 862,
            width: 469,
          },
          drilling: {
            sevenKafa: true,
            nanxing1: false,
            nanxing2: true,
            niteam: false,
          },
          lotNumber: "LOT-001",
          notes: "-",
        },{
          partName: "ALT TABLA",
          paketNo: "5/2",
          cinsi: "TY MDF",
          thickness: 18,
          unitCount: 1,
          totalCount: 0,
          materialColor: "Beyaz",
          macmazzeNet: {
            length: 824,
            width: 448,
          },
          pvcColor: "ATLANTİK ÇAM",
          edgeBanding: {
            eBanding: true,
            kBanding: false,
            bBanding: true,
          },
          channel: {
            length: "4mm TAM KANAL",
            width: "",
          },
          partSize: {
            length: 824,
            width: 449,
          },
          drilling: {
            sevenKafa: true,
            nanxing1: false,
            nanxing2: true,
            niteam: false,
          },
          lotNumber: "LOT-001",
          notes: "-",
        },{
          partName: "ORTA SABİT",
          paketNo: "5/2",
          cinsi: "SUNTALAM",
          thickness: 18,
          unitCount: 1,
          totalCount: 0,
          materialColor: "Beyaz",
          macmazzeNet: {
            length: 824,
            width: 309.5,
          },
          pvcColor: "Beyaz",
          edgeBanding: {
            eBanding: true,
            kBanding: false,
            bBanding: true,
          },
          channel: {
            length: "",
            width: "",
          },
          partSize: {
            length: 1739,
            width: 835,
          },
          drilling: {
            sevenKafa: true,
            nanxing1: false,
            nanxing2: true,
            niteam: false,
          },
          lotNumber: "LOT-001",
          notes: "-",
        },{
          partName: "ÜST TABLA",
          paketNo: "5/2",
          cinsi: "SUNTALAM",
          thickness: 18,
          unitCount: 1,
          totalCount: 0,
          materialColor: "ATLANTİK ÇAM",
          macmazzeNet: {
            length: 860.4,
            width: 467.4,
          },
          pvcColor: "Beyaz",
          edgeBanding: {
            eBanding: true,
            kBanding: false,
            bBanding: true,
          },
          channel: {
            length: "4mm Tam Kanal",
            width: "",
          },
          partSize: {
            length: 1739,
            width: 835,
          },
          drilling: {
            sevenKafa: true,
            nanxing1: false,
            nanxing2: true,
            niteam: false,
          },
          lotNumber: "LOT-001",
          notes: "-",
        }
      ],
    },
    { code: '152.01.0000143', name: 'İKİ KAPILI KİLER ATLANTİK', parts: [
      {
        partName: "SOL YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ] },
    { code: '152.01.0000142', name: 'İKİ KAPILI KİLER BEYAZ', parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ], },
    { code: '152.01.0000155', name: 'TEK KAPILI KİLER ATLANTİK' , parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ],},
    { code: '152.01.0000153', name: 'TEK KAPILI KİLER ATLANTİK-BEYAZ' , parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ],},
    { code: '152.01.0000154', name: 'TEK KAPILI KİLER BEYAZ' },
    { code: '152.01.0000149', name: 'KISA KİLER ATLANTİK' },
    { code: '152.01.0000147', name: 'KISA KİLER ATLANTİK-BEYAZ', parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ], },
    { code: '152.01.0000148', name: 'KISA KİLER BEYAZ', parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ], },
    { code: '152.01.0000581', name: 'ALBA PORTMANTO ATLANTİK-BEYAZ' , parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ],},
    { code: '152.01.0000576', name: 'SERRA PORTMANTO ATLANTİK-BEYAZ' , parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ],},
    { code: '152.01.0000592', name: 'MAYA PORTMANTO ATLANTİK-BEYAZ', parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ], },
    { code: '152.01.0000591', name: 'MAYA PORTMANTO BEYAZ' , parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ],},
    { code: '152.01.0000542', name: '1225 PORTMANTO ATLANTİK', parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ], },
    { code: '152.01.0000543', name: '1250 PORTMANTO ATLANTİK', parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ], },
    { code: '152.01.0000593', name: 'KEMER PORTMANTO ATLANTİK -BEYAZ', parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ], },
    { code: '152.01.0000630', name: 'A-53 AYAKKABILIK ATLANTİK - BEYAZ', parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ], },
    { code: '152.01.0000634', name: 'A-54 AYAKKABILIK ATLANTİK - BEYAZ' , parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ],},
    { code: '152.01.0000642', name: 'A-57 AYAKKABILIK ATLANTİK - BEYAZ' , parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ],},
    { code: '151.01.0000001', name: 'S 181-183 BEYAZ GÖVDE' , parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ],},
    { code: '151.01.0000002', name: 'S 182-184 BEYAZ GÖVDE', parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ], },
    { code: '151.01.0000003', name: 'S 185-186 BEYAZ GÖVDE', parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ], },
    { code: '151.01.0000004', name: 'S 187-188 BEYAZ GÖVDE', parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ], },
    { code: '151.01.0000005', name: 'S 172-174 BEYAZ GÖVDE', parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ], },
    { code: '151.01.0000006', name: 'S 152-154 BEYAZ GÖVDE', parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ], },
    { code: '151.01.0000007', name: 'S 060 ÇOK AMAÇLI DOLAP' , parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ],},
    { code: '151.01.0000008', name: 'S 092 ÇOK AMAÇLI DOLAP' , parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ],},
    { code: '151.01.0000009', name: 'S 1012 BEYAZ GÖVDE', parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ], },
    { code: '151.01.0000010', name: 'P 1012 AKÇA GÖVDE' , parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ],},
    { code: '151.01.0000011', name: 'P 1012 CEVİZ GÖVDE', parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ], },
    { code: '151.01.0000012', name: 'P 1082-1084 AKÇA GÖVDE', parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ], },
    { code: '151.01.0000013', name: 'P 1082-1084 CEVİZ GÖVDE', parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ], },
    { code: '151.01.0000014', name: 'S 181 BEYAZ KAPAK' , parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ],},
    { code: '151.01.0000015', name: 'S 182 BEYAZ KAPAK' , parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ],},
    { code: '151.01.0000016', name: 'S 183 BEYAZ KAPAK' , parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ],},
    { code: '151.01.0000017', name: 'S 184 BEYAZ KAPAK' , parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ],},
    { code: '151.01.0000018', name: 'S 185 BEYAZ KAPAK' , parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ],},
    { code: '151.01.0000019', name: 'S 186 BEYAZ KAPAK' , parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ],},
    { code: '151.01.0000020', name: 'S 187 BEYAZ KAPAK' , parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ],},
    { code: '151.01.0000021', name: 'S 188 BEYAZ KAPAK' , parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ],},
    { code: '151.01.0000022', name: 'S 172 BEYAZ KAPAK' , parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ],},
    { code: '151.01.0000023', name: 'S 174 BEYAZ KAPAK' , parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ],},
    { code: '151.01.0000024', name: 'S 152 BEYAZ KAPAK' , parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ],},
    { code: '151.01.0000025', name: 'S 154 BEYAZ KAPAK' , parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ],},
    { code: '151.01.0000026', name: 'S 1012 BEYAZ KAPAK', parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ], },
    { code: '151.01.0000027', name: 'P 1012 AKÇA KAPAK' , parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ],},
    { code: '151.01.0000028', name: 'P 1012 CEVİZ KAPAK', parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ], },
    { code: '151.01.0000029', name: 'P 1082 AKÇA KAPAK' , parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ],},
    { code: '151.01.0000030', name: 'P 1082 CEVİZ KAPAK', parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ], },
    { code: '151.01.0000031', name: 'P 1084 AKÇA KAPAK' , parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ],},
    { code: '151.01.0000032', name: 'P 1084 CEVİZ KAPAK', parts: [
      {
        partName: "SAĞ YAN",
        paketNo: "5/1",
        cinsi: "MDF",
        thickness: 18,
        unitCount: 2,
        totalCount: 4,
        materialColor: "Beyaz",
        macmazzeNet: {
          length: 120,
          width: 60,
        },
        pvcColor: "Beyaz",
        edgeBanding: {
          eBanding: true,
          kBanding: false,
          bBanding: true,
        },
        channel: {
          length: 30,
          width: 10,
        },
        partSize: {
          length: 120,
          width: 60,
        },
        drilling: {
          sevenKafa: true,
          nanxing1: false,
          nanxing2: true,
          niteam: false,
        },
        lotNumber: "LOT-001",
        notes: "Özel kesim",
      },
    ], }
  ]);

  // Lot eklemek için fonksiyon
  const addLot = (formData) => {
    const newLot = {
      lotNumber: formData.lotNumber,
      productCode: formData.productCode,
      productName: formData.productName,
      quantity: formData.quantity,
      status: formData.status
    };

    setLots((prevLots) => [...prevLots, newLot]);
  };

  // Product eklemek için fonksiyon
  const addProduct = (newProduct) => {
    setProducts((prevProducts) => [...prevProducts, newProduct]);
  };

  return (
    <LotContext.Provider value={{ lots, setLots, addLot, products, setProducts, addProduct }}>
      {children}
    </LotContext.Provider>
  );
};
