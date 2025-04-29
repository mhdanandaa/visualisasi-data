import React from "react";
import Sidebar from "./Sidebar.jsx"
import SidebarItem from "./SidebarItem";

import homeIcon from "../../assets/HomeIcon.svg";
import paymentIcon from "../../assets/PaymentIcon.svg";
import mapIcon from "../../assets/MapIcon.svg";
import timetIcon from "../../assets/TimeIcon.svg";
import addIcon from "../../assets/AddIcon.svg"

const SidebarFrame = () => {
  return (
    <Sidebar>
        <SidebarItem
          icon={<img src={homeIcon} className="w-6 h-6" />}
          text="Dashboard"
          to="/"
        />
        <SidebarItem
          icon={<img src={paymentIcon} className="w-6 h-6" />}
          text="Pemasukan"
          to="/income"
        />
        <SidebarItem
          icon={<img src={mapIcon} className="w-6 h-6" />}
          text="Geografis"
          to="/geography"
        />
        <SidebarItem
          icon={<img src={timetIcon} className="w-6 h-6" />}
          text="Waktu"
          to="/time"
        />
        <SidebarItem
          icon={<img src={addIcon} className="w-6 h-6" />}
          text="Input"
          to="/input"
        />
    </Sidebar>
  );
};

export default SidebarFrame;
