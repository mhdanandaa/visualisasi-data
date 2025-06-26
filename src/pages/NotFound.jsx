import { Link } from "react-router-dom";
import BgImage from "../assets/Bg_notfound.jpeg";
import Logo from "../assets/LogoKeraton.svg";

const NotFound = () => {
  return (
    <div
      className="w- h-screen bg-cover bg-center flex justify-center items-center"
      style={{ backgroundImage: `url(${BgImage})` }}
    >
      <div className="absolute top-6 left-6">
        <img src={Logo} className="w-28 h-28" />
      </div>
      <div className="flex flex-col items-center">
        <h1 className="font-bold text-9xl text-white">
          4<span className="text-green-muda">0</span>4
        </h1>
        <h2 className="text-3xl text-white font-semibold">
          Halaman tidak ditemukan 🥺
        </h2>
        <Link to="/">
          <div className="bg-green-muda rounded-md mt-3">
            <h2 className="px-4 py-2 text-white font-semibold">Kembali</h2>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
