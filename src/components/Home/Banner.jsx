import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import dateIcon from "../../assets/DateIcon.svg";

import language from "../../assets/Language.svg";

const Banner = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", true);
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", false);
    }
  }, [isDarkMode]);

  const buttonDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

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
    if (hour >= 3 && hour < 11) return t("home.banner.time.morning");
    else if (hour >= 11 && hour < 15) return t("home.banner.time.afternoon");
    else if (hour >= 15 && hour < 18) return t("home.banner.time.evening");
    else return t("home.banner.time.night");
  };

  const timeCategory = getTimeCategory(today.getHours());
  const [currentDate] = useState(getDate());

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const handleLanguageChange = (event) => {
    const lang = event.target.value;
    changeLanguage(lang);
    setSelectedLanguage(lang);
  };

  return (
    <div className="flex mr-4 mt-4">
      <h1 className="text-brown-custom font-bold text-xl">
        {t("home.banner.greating")} {timeCategory}, Admin!
      </h1>
      <div className="flex ml-auto">
        <div className="flex items-center bg-white rounded-md px-4 py-1 mx-2">
          <img src={dateIcon} className="w-6" />
          <h1 className="text-gray-custom font-semibold text-sm pl-1">
            {currentDate}
          </h1>
        </div>
        <div className="flex items-center bg-white rounded-md mr-2 px-2 py-1">
          <button onClick={buttonDarkMode}>{isDarkMode ? "☀️" : "🌙"}</button>
        </div>
        <div className="flex items-center bg-white rounded-md px-2 py-1">
          <img src={language} className="w-5" />
          <select
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="px-3 py-1  rounded-md bg-white text-gray-custom outline-none"
          >
            <option value="id">Indonesia</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Banner;
