import React, { useState } from "react";
import SidebarFrame from "../../Components/Sidebar/SidebarFrame";
import DurasiHari from "../../components/Time/DurasiHari";
import Navbar from "../../components/Navbar";
import DatePicker from "../../components/Income/DatePicker";
import KunjunganHari from "../../components/Time/KunjunganHari";
import RataHari from "../../components/Time/RataHari";
import DurasiTiket from "../../components/Time/DurasiTiket";
import RataTiket from "../../components/Time/RataTiket";
import JamMasukTiket from "../../components/Time/JamMasukTiket";
import WaktuKunjunganTiket from "../../components/Time/WaktuKunjunganTiket";
import { useTranslation } from "react-i18next";

const TimePage = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date("2024-07-03"),
    endDate: new Date("2024-07-13"),
    key: "selection",
  });

  const {t} = useTranslation()

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex mt-16">
        <SidebarFrame />
        <main className="w-full">
          <div className="w-full mb-4 mt-4 px-4 flex justify-between items-center">
            <h1 className="font-semibold text-2xl text-label-custom dark:text-white">
              {t("time.title")}
            </h1>
            <DatePicker dateRange={dateRange} onChange={setDateRange} />
          </div>
          <div className="grid grid-cols-2 gap-4 mr-4 mt-4">
            <JamMasukTiket dateRange={dateRange} />
            <div className="col-span-1">
              <WaktuKunjunganTiket dateRange={dateRange} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mr-4 mt-4">
            <DurasiHari dateRange={dateRange} />
            <div className="col-span-2">
              <RataHari dateRange={dateRange} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mr-4 mt-4">
            <div className="col-span-2">
              <RataTiket dateRange={dateRange} />
            </div>
            <DurasiTiket dateRange={dateRange} />
          </div>
          <div className="grid grid-cols-1 gap-4 my-4 mr-4">
            <KunjunganHari dateRange={dateRange} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TimePage;
