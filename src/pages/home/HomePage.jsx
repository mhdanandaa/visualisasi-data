import React from "react";
import SidebarFrame from "../../Components/Sidebar/SidebarFrame";
import Banner from "../../Components/Home/Banner";
import Navbar from "../../Components/Navbar";

const HomePage = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex mt-16">
        <SidebarFrame />
        <main className="w-full">
          <div className="w-full mb-4">
            <Banner />
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
