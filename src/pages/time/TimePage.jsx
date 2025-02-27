import React from "react";
import { useTranslation } from "react-i18next";
import SidebarFrame from "../../Components/Sidebar/SidebarFrame";

const TimePage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex">
      <SidebarFrame />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">{t("banner.line")}</h1>
      </main>
    </div>
  );
};

export default TimePage;
