import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import keraton from "../../assets/LoginImg.jpeg";
import logo from "../../assets/LogoKeraton.svg";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Username dan password wajib diisi");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const result = await response.json();

      if (result.success) {
        sessionStorage.setItem("isLoggedIn", "true");
        alert("Selamat Datang");
        navigate("/");
      } else {
        alert("Gagal login. Silahkan periksa username dan password");
      }
    } catch (error) {
      console.log("Login error:", error);
      alert("Terjadi kesalahan saat login");
    }
  };

  return (
    <div className="h-screen flex flex-row">
      {/* Bg Kiri */}
      <div className="bg-white w-1/2 h-full pl-16 py-16">
        <div className="flex justify-center items-center bg-white w-full h-full rounded-l-lg shadow-2xl">
          <div className="pt-6">
            <form onSubmit={handleSubmit}>
              <label>
                {/* Logo */}
                <div className="flex">
                  <img src={logo} alt="" className="h-12" />
                  <div className="flex-row pl-4">
                    <h1 className="font-semibold text-lg text-gray-700">
                      Tren
                    </h1>
                    <h1 className="font-semibold text-lg text-gray-700">
                      Kasepuhan
                    </h1>
                  </div>
                </div>

                {/* Tulisan Login */}
                <div className="pt-6 pb-10">
                  <h1 className="font-bold text-3xl">Login</h1>
                  <p className="text-gray-500">
                    Masukkan username dan password anda!
                  </p>
                </div>

                {/* Form Input */}
                <div className="py-8">
                  <p className="text-gray-500">Username</p>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex bg-white py-2 border border-gray-400 px-2 rounded-3xl w-full focus:outline-none focus:ring focus:ring-gray-200"
                  />
                  <p className="pt-8 text-gray-500">Password</p>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex bg-white border border-gray-400 py-2 px-2 rounded-3xl w-full focus:outline-none focus:ring focus:ring-gray-200"
                  />
                </div>
                <button
                  type="submit"
                  className="py-2 px-2 bg-green-muda text-white font-semibold rounded-2xl w-full"
                >
                  Login
                </button>
              </label>
            </form>
          </div>
        </div>
      </div>

      {/* Bg Kanan */}
      <div
        className="w-1/2 h-full pr-16 py-16 bg-cover bg-center flex justify-center items-center"
        style={{ backgroundImage: `url(${keraton})` }}
      >
        <div className="bg-gradient-to-tl from-green-muda/80 to-black w-full h-full rounded-r-lg shadow-2xl">
          <div className="pt-20 px-8">
            <h1 className="font-bold text-3xl text-white">Selamat Datang!</h1>
            <p className="text-white">Portal Tren Kasepuhan</p>
          </div>
          <img
            src={keraton}
            alt=""
            className="w-full max-w-[600px] h-auto object-cover rounded-xl mx-auto mt-10"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
