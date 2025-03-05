import React from "react";
import SidebarFrame from "../../Components/Sidebar/SidebarFrame";
import Banner from "../../Components/Home/Banner";
import Navbar from "../../Components/Navbar";
import TotalPengunjung from "../../components/Home/TotalPengunjung";
import TotalTiket from "../../components/Home/TotalTiket";
import TotalPendapatan from "../../components/Home/TotalPendapatan";
import WaktuKunjungan from "../../components/Home/WaktuKunjungan";
import Kapasitas from "../../components/Home/Kapasitas";
import Hari from "../../components/Home/Hari";
import TotalPenjualan from "../../components/Home/TotalPenjualan";

const HomePage = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex mt-16">
        <SidebarFrame />
        <main className="w-full">
          <div className="w-full mb-4">
            <Banner />
          </div>
          <div className="grid grid-cols-3 gap-4 mr-4">
            <TotalPengunjung />
            <TotalPengunjung />
            <TotalTiket />
          </div>
          <div className="grid grid-cols-4 gap-4 mr-4 mt-4">
            <TotalPendapatan />
            <WaktuKunjungan />
            <div className="col-span-2">
            <Kapasitas />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mr-4 mt-4">
            <Hari />
            <TotalPenjualan />
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
