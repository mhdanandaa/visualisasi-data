import React from "react";
import { useTranslation } from "react-i18next";

const Banner = () => {
  const { t } = useTranslation();

  const today = new Date();

  const getTimeCategory = (hour) => {
    if (hour >= 3 && hour < 11) return t("home.banner.time.morning");
    else if (hour >= 11 && hour < 15) return t("home.banner.time.afternoon");
    else if (hour >= 15 && hour < 18) return t("home.banner.time.evening");
    else return t("home.banner.time.night");
  };

  const timeCategory = getTimeCategory(today.getHours());

  return (
    <div className="flex mr-4 mt-4">
      <h1 className="text-brown-custom font-bold text-xl">
        {t("home.banner.greating")} {timeCategory}, Admin 👋
      </h1>
    </div>
  );
};

export default Banner;
