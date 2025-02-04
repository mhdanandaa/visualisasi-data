import React from "react";
import Sidebar from "./Sidebar";
import SidebarItem from "./SidebarItem";

import homeIcon from "../assets/HomeIcon.svg";
import paymentIcon from "../assets/PaymentIcon.svg";
import mapIcon from "../assets/MapIcon.svg";
import timetIcon from "../assets/TimeIcon.svg";

const SidebarFrame = () => {
  return (
    <Sidebar>
      <SidebarItem
        icon={<img src={homeIcon} className="w-6 h-6" />}
        text="Dashboard"
        active
      />
      <SidebarItem
        icon={<img src={paymentIcon} className="w-6 h-6" />}
        text="Pemasukan"
      />
      <SidebarItem
        icon={<img src={mapIcon} className="w-6 h-6" />}
        text="Geografis"
      />
      <SidebarItem
        icon={<img src={timetIcon} className="w-6 h-6" />}
        text="Waktu"
      />
    </Sidebar>
  );
};

export default SidebarFrame;
