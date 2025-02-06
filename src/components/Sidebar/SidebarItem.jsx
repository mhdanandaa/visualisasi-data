import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { SidebarContext } from "./Sidebar";

const SidebarItem = ({ icon, text, to }) => {
  const { expanded } = useContext(SidebarContext);

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative flex items-center py-3 px-3 my-4 font-medium rounded-lg cursor-pointer transition-colors group
        ${
          isActive
            ? "bg-green-muda text-white" // Saat link aktif
            : "bg-kuning-emas text-white hover:bg-green-muda" // Saat link tidak aktif
        }`
      }
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>

      {!expanded && (
        <div
          className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-green-muda text-white text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
        >
          {text}
        </div>
      )}
    </NavLink>
  );
};

export default SidebarItem;
