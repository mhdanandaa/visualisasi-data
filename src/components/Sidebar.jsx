import { createContext, useState, useEffect } from "react";
import { ChevronFirst, ChevronLast } from "lucide-react";

import logo from "../assets/LogoKeraton.svg";
import logoutIcon from "../assets/LogoutIcon.svg";

export const SidebarContext = createContext();

const Sidebar = ({ children }) => {
  const [expanded, setExpanded] = useState(() => {
    const storedExpanded = localStorage.getItem("sidebar-expanded");
    return storedExpanded !== null ? JSON.parse(storedExpanded) : true;
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", JSON.stringify(expanded));
  }, [expanded]);

  return (
    <SidebarContext.Provider value={{ expanded }}>
      <aside className="h-screen my-4 mx-4">
        <nav className="h-full flex flex-col bg-white border-r shadow-sm rounded-2xl">
          <div className="p-4 pb-10 flex justify-between items-center">
            <img
              src={logo}
              alt="Logo Keraton"
              className={`overflow-hidden transition-all ${
                expanded ? "w-10" : "w-0"
              }`}
            />
            <h1
              className={`overflow-hidden transition-all font-bold ${
                expanded ? "ml-2" : "w-0"
              }`}
            >
              Tren Kasepuhan
            </h1>
            <button
              onClick={() => setExpanded((current) => !current)}
              className="p-2 rounded-lg w-10 h-12  hover:bg-gray-100"
            >
              {expanded ? (
                <ChevronFirst />
              ) : (
                <img
                  src={logo}
                  alt="Logo Keraton"
                />
              )}
            </button>
          </div>
          <ul className="flex-1 px-3 pt-24">{children}</ul>
          <div className="border-t flex p-3 justify-center items-center">
            <img
              src={logoutIcon}
              alt="Logout Icon"
              className="w-10 h-10 rounded-md"
            />
          </div>
        </nav>
      </aside>
    </SidebarContext.Provider>
  );
};

export default Sidebar;
