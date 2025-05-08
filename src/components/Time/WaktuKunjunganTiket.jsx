import { isWithinInterval, parse } from "date-fns";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from "chart.js";
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  

const WaktuKunjunganTiket = ({dateRange}) => {
  const [datas, setDatas] = useState([]);

  const fetchDatas = async () => {
    try {
      const response = await fetch("/API/Time/kunjungan-waktu.json");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      const filtered = data.filter((item) => {
        const itemDate = parse(item.tanggal, "dd-MM-yyyy", new Date());
        return isWithinInterval(itemDate, {
          start: dateRange.startDate,
          end: dateRange.endDate,
        });
      });

      setDatas(filtered);
    } catch (error) {
      console.log("Error mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchDatas();
  }, [dateRange]);

  const barData = () => {
    const allKategori = Array.from(
      new Set(datas.map((item) => item.waktu_kunjungan))
    ).sort();

    const ticketTotals = {};

    datas.forEach((item) => {
      const jenis = item.jenis_tiket;
      const totalPengunjung = item.total_pengunjung;
      const kategoriWaktu = item.waktu_kunjungan;

      if (!ticketTotals[jenis]) {
        ticketTotals[jenis] = {};
      }if (!ticketTotals[jenis][kategoriWaktu]) {
        ticketTotals[jenis][kategoriWaktu] = 0;
      }
      ticketTotals[jenis][kategoriWaktu] += totalPengunjung;
    });

    const bgColor = [
      "#BC6C25",
      "#658864",
      "#ECD79B",
      "#ADADAD",
      "#B7B78A",
      "#ECAB9B",
      "#C09E7F",
    ];

    const datasets = Object.keys(ticketTotals).map((jenis, index) => ({
      label: jenis,
      data: allKategori.map((kategori) => ticketTotals[jenis][kategori] || 0),
      backgroundColor: bgColor[index % bgColor.length],
    }));
    return {
      labels: allKategori.map((kategori) => kategori),
      datasets,
    };
  };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };
  return (
    <div className="bg-bg-card rounded-2xl px-4 py-4 h-full">
      <h1 className="font-semibold text-sm">Total Kunjungan Dari Kategori Waktu Berdasarkan Jenis Tiket</h1>
      {datas.length === 0 ? (
        <p className="text-center text-sm text-gray-500">alamak takde bg</p>
      ) : (
        <div className="h-[300px] w-full py-4">
          <Bar data={barData()} options={options} />
        </div>
      )}
    </div>
  );
};

export default WaktuKunjunganTiket;
