import { useState } from "react";
import dateIcon from "../../assets/DateIcon.svg";

const Banner = () => {
  const today = new Date();

  const getDate = () => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "Mei",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Okt",
      "Nov",
      "Des",
    ];
    const month = monthNames[today.getMonth()];
    const year = today.getFullYear();
    const date = today.getDate();
    const hour = today.getHours();
    const minute = today.getMinutes().toString().padStart(2, "0");
    return `${month} ${date}, ${year} ${hour}:${minute}`;
  };

  const getTimeCategory = (hour) => {
    // console.log("Jam saat ini:", hour)
    if (hour >= 3 && hour < 11) {
      return "Pagi";
    } else if (hour >= 11 && hour < 15) {
      return "Siang";
    } else if (hour >= 15 && hour < 18) {
      return "Sore";
    } else return "Malam";
  };

  const timeCategory = getTimeCategory(today.getHours());

  const [currentDate, setCurrentDate] = useState(getDate());

  return (
    <div className="flex mr-4 mt-4">
      <h1 className="text-brown-custom font-bold text-xl">
        Selamat {timeCategory}, Admin!
      </h1>
      <div className="flex ml-auto ">
        <div className="flex items-center bg-white rounded-md px-4 py-1">
          <img src={dateIcon} className="w-6" />
          <h1 className="text-gray-custom font-semibold text-sm pl-1">
            {currentDate}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Banner;
