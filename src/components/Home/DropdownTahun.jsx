import React from "react";

const DropdownTahun = ({ years, selectedYear, onChange }) => {
  return (
    <select
      value={selectedYear}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="border px-8 py-2 rounded-xl bg-white outline-none font-semibold"
    >
      {years.length === 0 ? (
        <option value="">Memuat tahun...</option>
      ) : (
        years.map((year) => (
          <option key={year} value={year}>
           {year}
          </option>
        ))
      )}
    </select>
  );
};

export default DropdownTahun;
