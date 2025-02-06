import { useState } from "react";
import imgBanner from "../../assets/BannerImg.svg";
import dateIcon from "../../assets/DateIcon.svg";

const Banner = () => {
  const getDate = () => {
    const today = new Date();
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const month = monthNames[today.getMonth() + 1];
    const year = today.getFullYear();
    const date = today.getDate();
    const hour = today.getHours();
    const minute = today.getMinutes().toString().padStart(2, "0");
    return `${month} ${date}, ${year} ${hour}:${minute}`;
  };

  const [currentDate, setCurrentDate] = useState(getDate());

  return (
    <div className="flex-col py-4 px-4 bg-gradient-to-l from-kuning-emas/70 to bg-green-muda rounded-2xl">
      <div className="flex items-center bg-green-date w-1/3 rounded-md px-1 py-1">
        <img src={dateIcon} className="w-6" />
        <h1 className="text-white font-light text-sm pl-1">{currentDate}</h1>
      </div>

      <div className="flex items-end">
        <div className="flex-col">
          <h1 className="text-white font-semibold">Hallo, Admin</h1>
          <h1 className="text-white font-light text-sm">
            Semoga Harimu Menyenangkan!
          </h1>
        </div>
        <img src={imgBanner} className="ml-auto w-1/2" />
      </div>
    </div>
  );
};

export default Banner;
