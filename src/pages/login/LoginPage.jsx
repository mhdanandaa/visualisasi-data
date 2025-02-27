import React from "react";
import keraton from "../../assets/IconLogin.jpeg";
import logo from "../../assets/LogoKeraton.svg";

const LoginPage = () => {
  const handleSubmit = () => {
    alert("Anda Berhasil Login!");
  };

  return (
    <div className="h-screen flex flex-row">
      {/* Bg Kiri */}
      <div className="bg-white w-1/2 h-full pl-16 py-16">
        <div className="flex justify-center items-center bg-white w-full h-full rounded-l-lg shadow-2xl">
          <div className="pt-6">
            <form>
              <label>
                {/* Bagian Logo */}
                <div className="flex">
                  <img src={logo} alt="" className="h-12" />
                  <div className="flex-row pl-4">
                    <h1 className="font-semibold text-lg text-gray-700">
                      Tren
                    </h1>
                    <h1 className="font-semibold text-lg text-gray-700 ">
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
                    // value={name}
                    // onChange={(e) => setName(e.target.value)}
                    className="flex bg-white py-2 border border-gray-400 px-2 rounded-3xl w-full focus:outline-none focus:ring focus:ring-gray-200"
                  />
                  <p className="pt-8 text-gray-500">Password</p>
                  <input
                    type="password"
                    // value={name}
                    // onChange={(e) => setName(e.target.value)}
                    className="flex bg-white border border-gray-400 py-2 px-2 rounded-3xl w-full focus:outline-none focus:ring focus:ring-gray-200"
                  />
                </div>
                <button
                  type="submit"
                  className="py-2 px-2 bg-green-muda text-white font-semibold rounded-2xl w-full"
                  onClick={handleSubmit}
                >
                  Login
                </button>
              </label>
            </form>
          </div>
        </div>
      </div>

      {/* Bg Kanan */}
      <div className="bg-kuning-emas w-1/2 h-full pr-16 py-16">
        <div className="bg-gradient-to-tl from-emas-gradient/60 to-kuning-emas w-full h-full rounded-r-lg shadow-2xl">
          <div className="pt-20 px-12">
            <h1 className="font-bold text-3xl text-white">Selamat Datang!</h1>
            <p className="text-white">Portal Tren Kasepuhan</p>
          </div>
          <img
            src={keraton}
            alt=""
            className="h-[60%] rounded-3xl ml-12 mt-10"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
