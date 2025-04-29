import React, { useEffect, useState } from "react";
import SidebarFrame from "../../Components/Sidebar/SidebarFrame";
import Banner from "../../Components/Home/Banner";
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
      "/API/Dashboard/total-pengunjung.json",
      "/API/Dashboard/pengunjung-hari.json",
    ];

    try {
      const yearSet = new Set();

      for (const url of urls) {
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`HTTP error from ${url}! status: ${response.status}`);

        const data = await response.json();

        data.forEach((item) => {
          const year = item.tahun;
          if (year) yearSet.add(year);
        });
      }

      const sortedYears = Array.from(yearSet).sort();
      setAvailableYears(sortedYears);

      if (sortedYears.length > 0) setSelectedYear(sortedYears[0]);
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
