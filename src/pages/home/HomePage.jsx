import React, { useEffect, useState } from "react";
import SidebarFrame from "../../components/Sidebar/SidebarFrame";
import Banner from "../../components/Home/Banner";
import Navbar from "../../components/Navbar";
import TotalPengunjung from "../../components/Home/TotalPengunjung";
import WaktuKunjungan from "../../components/Home/WaktuKunjungan";
import Kapasitas from "../../components/Home/Kapasitas";
import Hari from "../../components/Home/PengunjungHari";
import TotalPenjualan from "../../components/Home/TotalPenjualan";
import PendapatanPie from "../../components/Home/PendapatanPie";
import TotalPendapatan from "../../components/Home/TotalPendapatan";
import DropdownTahun from "../../components/Home/DropdownTahun";
import TotalDurasi from "../../components/Home/TotalDurasi";

const HomePage = () => {
  const [selectedYear, setSelectedYear] = useState("");
  const [availableYears, setAvailableYears] = useState([]);

  const fetchAllDatas = async () => {
    const urls = [
      "https://json.sthresearch.site/Dashboard/total-pengunjung.json",
    ];

    try {
      const yearSet = new Set();

      for (const url of urls) {
        const response = await fetch(url);

        const rawText = await response.text();
        console.log("RESPON MENTAH DARI API:", rawText);

        if (!response.ok)
          throw new Error(`HTTP error dari ${url}! status: ${response.status}`);

        try {
          const data = JSON.parse(rawText);
          console.log("Data terparse:", data);

          if (Array.isArray(data)) {
            data.forEach((item) => {
              const year = item.tahun;
              if (year) yearSet.add(year);
            });
          } else {
            console.error("Data bukan array:", data);
          }

        } catch (parseErr) {
          console.error("Gagal parsing JSON:", parseErr);
        }
      }

      const sortedYears = Array.from(yearSet).sort();
      setAvailableYears(sortedYears);
      console.log("Tahun yang tersedia:", sortedYears);

      if (sortedYears.length > 0) {
        setSelectedYear(sortedYears[0]);
      }
    } catch (error) {
      console.error("Gagal mengambil data dari API:", error);
    }
  };

  useEffect(() => {
    fetchAllDatas();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex mt-16">
        <SidebarFrame />
        <main className="w-full">
          <div className="flex w-full justify-between">
            <Banner />
            <div className="mt-4 mb-4 mx-4">
              <DropdownTahun
                years={availableYears}
                selectedYear={selectedYear}
                onChange={setSelectedYear}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mr-4">
            <TotalPengunjung selectedYear={selectedYear} />
            <TotalDurasi selectedYear={selectedYear} />
            <TotalPendapatan selectedYear={selectedYear} />
          </div>
          <div className="grid grid-cols-4 gap-4 mr-4 mt-4">
            <PendapatanPie selectedYear={selectedYear} />
            <Kapasitas selectedYear={selectedYear} />
            <div className="col-span-2">
              <Hari selectedYear={selectedYear} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mr-4 mt-4 mb-4">
            <div className="col-span-2">
              <TotalPenjualan selectedYear={selectedYear} />
            </div>
            <WaktuKunjungan selectedYear={selectedYear} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
