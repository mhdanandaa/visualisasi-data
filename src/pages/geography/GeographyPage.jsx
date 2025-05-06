import React from "react";
import SidebarFrame from "../../components/Sidebar/SidebarFrame";
import Navbar from "../../components/Navbar";
import Maps from "../../components/Geography/Maps";
import { useTranslation } from "react-i18next";

const GeographyPage = () => {
  const {t} = useTranslation()
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex mt-16">
        <SidebarFrame />
        <main className="w-full">
          <div className="w-full mb-4 mt-4">
            <h1 className="font-semibold text-2xl">{t("geo.title")}</h1>
          </div>
          <div className="mr-4 mb-4">
            <Maps />
          </div>
        </main>
      </div>
    </div>
  );
};

export default GeographyPage;
