import React, { useState } from "react";
import SidebarFrame from "../../Components/Sidebar/SidebarFrame";
import Navbar from "../../components/Navbar";
import BarWaktu from "../../components/Income/BarWaktu";
import JenisPembayaran from "../../components/Income/JenisPembayaran";
import DatePicker from "../../components/Income/DatePicker";
import PieTiket from "../../components/Income/PieTiket";
import DoughnutHari from "../../components/Income/DoughnutHari";
import PendapatanHari from "../../components/Income/PendapatanHari";
import AllPembayaran from "../../components/Income/AllPembayaran";
const IncomePage = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date("2024-07-01"),
    endDate: new Date("2024-07-03"),
    key: "selection",
  });
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex mt-16">
        <SidebarFrame />
        <main className="w-full">
          <div className="w-full mb-4 mt-4">
            <h1 className="font-semibold text-2xl">Pendapatan</h1>
          </div>
          <div className="grid grid-cols-3 gap-4 mr-4 mt-4">
            <PieTiket dateRange={dateRange} />
            <DoughnutHari dateRange={dateRange} />
            <div className="col-span-1">
              <DatePicker dateRange={dateRange} onChange={setDateRange} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mr-4 mt-4 mb-4">
            <div className="col-span-2">
              <BarWaktu dateRange={dateRange} />
            </div>
            <JenisPembayaran dateRange={dateRange} />
          </div>
          <div className="grid grid-cols-3 gap-4 my-4 mr-4">
            <AllPembayaran dateRange={dateRange} />
            <div className="col-span-2">
              <PendapatanHari dateRange={dateRange} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default IncomePage;
