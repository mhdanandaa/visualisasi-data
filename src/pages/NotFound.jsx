import React from "react";
import BgImage from "../assets/Bg_notfound.jpeg";
import Logo from "../assets/LogoKeraton.svg";

const NotFound = () => {
  return (
    <div
      className="w-full h-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${BgImage})` }}
    >
      <img src={Logo} className="w-28 h-28" />
      <div className="flex-col">
        <h1 className="font-bold text-9xl text-khaki">
          4<span className="text-green-muda">0</span>4
        </h1>
        <h2 className="text-3xl text-white font-semibold">
          Halaman tidak ditemukan 🥺
        </h2>
        <button>
        </button>
      </div>
    </div>
  );
};

export default NotFound;
