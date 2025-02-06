import React from "react";
import SidebarFrame from "../../Components/Sidebar/SidebarFrame";

const IncomePage = () => {
  return (
    <div className="flex">
      <SidebarFrame />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold">I</h1>
      </main>
    </div>
  );
};

export default IncomePage;
