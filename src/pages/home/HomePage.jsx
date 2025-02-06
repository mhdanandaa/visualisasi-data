import React from "react";
import SidebarFrame from "../../Components/Sidebar/SidebarFrame";
import Banner from "../../Components/Home/Banner";

const HomePage = () => {
  return (
    <div className="flex">
      <SidebarFrame />
      <main className="flex-1 p-6">
        <div className="w-[40%]">
          <Banner />
        </div>
      </main>
    </div>
  );
};

export default HomePage;
