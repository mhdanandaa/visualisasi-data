import React, { useState } from "react";
import SidebarFrame from "../Components/Sidebar/SidebarFrame";
import Navbar from "../components/Navbar";

const InputData = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Pilih file terlebih dahulu.");
      return;
    }

    const formData = new FormData();
    formData.append("excel", file);

    try {
      const response = await fetch("http://localhost:3001/api/upload-excel", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        setStatus("Upload dan import berhasil!");
      } else {
        setStatus("Upload gagal: " + result.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("Terjadi kesalahan saat upload.");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex mt-16">
        <SidebarFrame />
        <main className="w-full">
          <div className="w-full mb-4 mt-4">
            <h1 className="font-semibold text-2xl">Input Data Kunjungan</h1>
          </div>
          <div className="flex flex-col bg-bg-card items-center justify-center h-screen gap-4 mr-4 mb-4 rounded-3xl">
            <h1 className="text-2xl font-bold">Silahkan Pilih File Excel!</h1>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="border p-2 border-gray-300"
            />
            <button
              onClick={handleUpload}
              className="bg-green-muda text-white px-4 py-2 rounded-md"
            >
              Upload
            </button>
            {status && <p className="text-center mt-4">{status}</p>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default InputData;
