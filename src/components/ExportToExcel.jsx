import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
const ExportToExcel = ({ data, fileName = "dosya", sheetName = "Sayfa1" }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  };

  const exportToExcel = () => {
    const rows = [];

    data.forEach((lot) => {
      lot.parts.forEach((part) => {
        rows.push({
          "Lot No": lot.lotNumber,
          "Ürün Adı": lot.productName,
          "Ürün Kodu": lot.productCode,
          Cinsi: part.cinsi,
          Başlama: formatDate(part.operations[0]?.startTime),
          Bitiş: formatDate(part.operations[0]?.endTime),
        });
      });
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, `${fileName}.xlsx`);
  };
  return (
    <button
      onClick={exportToExcel}
      style={{
        cursor: "pointer",
      }}
      className="btn btn-success text-white"
    >
      <div>
        <span> Excel'e Aktar</span>{" "}
        <img src="excel_logo.png" width={50} height={30} />
      </div>
    </button>
  );
};

export default ExportToExcel;
