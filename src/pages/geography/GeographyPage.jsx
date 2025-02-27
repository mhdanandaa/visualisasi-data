import React from "react";
import SidebarFrame from "../../Components/Sidebar/SidebarFrame";
import Banner from "../../Components/Home/Banner";

const GeographyPage = () => {
  return (
    <div className="flex">
      <SidebarFrame />
      <main className="flex-1 p-6">
        <Banner />
        <h1 className="text-2xl font-bold">Geography</h1>
      </main>
    </div>
  );
};

export default GeographyPage;
