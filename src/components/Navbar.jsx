import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import dateIcon from "../assets/DateIcon.svg";

import language from "../assets/Language.svg";

const Navbar = () => {
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

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const handleLanguageChange = (event) => {
    const lang = event.target.value;
    changeLanguage(lang);
    setSelectedLanguage(lang);
  };
  const [currentDate] = useState(getDate());

  return (
    <div>
      <nav className="bg-bg-card dark:bg-dark-mode w-full fixed top-0 left-0 z-50 shadow-md">
        <div className="flex justify-center items-center w-full px-4 py-3">
          <a href="/"><h1 className="font-bold text-kuning-emas">
            Tren<span className="text-green-muda"> Kasepuhan</span>
          </h1>
          </a>
          <div className="flex ml-auto">
            <div className="flex items-center bg-bg-custom dark:bg-dark-bg rounded-xl px-4 py-1 mx-2">
              <img src={dateIcon} className="w-6" />
              <h1 className="text-gray-custom dark:text-white font-medium text-sm pl-1">
                {currentDate}
              </h1>
            </div>
            <div className="flex items-center bg-bg-custom dark:bg-dark-bg rounded-xl mr-2 px-2 py-1">
              <button onClick={buttonDarkMode}>
                {isDarkMode ? "☀️" : "🌙"}
              </button>
            </div>
            <div className="flex items-center bg-bg-custom dark:bg-dark-bg rounded-xl px-2 py-1">
              <img src={language} className="w-5" />
              <select
                value={selectedLanguage}
                onChange={handleLanguageChange}
                className="px-3 py-1 rounded-xl bg-bg-custom dark:bg-dark-bg text-gray-custom dark:text-white outline-none"
              >
                <option value="id">Indonesia</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
