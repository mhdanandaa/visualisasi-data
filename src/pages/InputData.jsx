import React, { useState } from "react";
import SidebarFrame from "../Components/Sidebar/SidebarFrame";
import Navbar from "../components/Navbar";

const InputData = () => {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [showExample, setShowExample] = useState(false); 

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setShowExample(false);
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
        setShowExample(false);
      } else {
        setStatus("Upload gagal: " + result.message);
        setShowExample(true);
      }
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("Terjadi kesalahan saat upload.");
      setShowExample(true);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex mt-16">
        <SidebarFrame />
        <main className="w-full">
          <div className="w-full mb-4 mt-4">
            <h1 className="font-semibold text-2xl text-label-custom dark:text-white">
              Input Data Kunjungan
            </h1>
          </div>
          <div className="flex flex-col bg-bg-card dark:bg-dark-mode items-center justify-center h-screen gap-4 mr-4 mb-4 rounded-3xl">
            <h1 className="text-2xl font-bold text-label-custom dark:text-white">
              Silahkan Pilih File Excel!
            </h1>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              className="border p-2 border-gray-300 text-label-custom dark:text-white"
            />
            <button
              onClick={handleUpload}
              className="bg-green-muda text-white px-4 py-2 rounded-md"
            >
              Upload
            </button>
            {status && (
              <p className="text-center mt-4 text-label-custom dark:text-white">
                {status}
              </p>
            )}

            {showExample && (
              <div className="mt-6 text-sm bg-white dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <p className="font-semibold text-label-custom dark:text-white mb-2">
                  Contoh Format Excel:
                </p>
                <table className="table-auto border-collapse border border-gray-400 text-left text-label-custom dark:text-white">
                  <thead>
                    <tr>
                      <th className="border px-2 py-1">No</th>
                      <th className="border px-2 py-1">Tanggal</th>
                      <th className="border px-2 py-1">Pelanggan</th>
                      <th className="border px-2 py-1">Nama Tiket</th>
                      <th className="border px-2 py-1">Ketersediaan Item</th>
                      <th className="border px-2 py-1">Jenis Tiket</th>
                      <th className="border px-2 py-1">Pembayaran</th>
                      <th className="border px-2 py-1">Jumlah</th>
                      <th className="border px-2 py-1">Harga</th>
                      <th className="border px-2 py-1">Total</th>
                      <th className="border px-2 py-1">Total Dibayar</th>
                      <th className="border px-2 py-1">Dihapus</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-2 py-1">Integer</td>
                      <td className="border px-2 py-1">Date Time</td>
                      <td className="border px-2 py-1">String</td>
                      <td className="border px-2 py-1">String</td>
                      <td className="border px-2 py-1">String</td>
                      <td className="border px-2 py-1">String</td>
                      <td className="border px-2 py-1">String</td>
                      <td className="border px-2 py-1">Integer</td>
                      <td className="border px-2 py-1">Integer</td>
                      <td className="border px-2 py-1">Integer</td>
                      <td className="border px-2 py-1">Integer</td>
                      <td className="border px-2 py-1">String</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default InputData;
