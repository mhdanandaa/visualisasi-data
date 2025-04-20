import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TotalPenjualan = ({ selectedYear }) => {
  const { t } = useTranslation();

  const [datas, setDatas] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);

  const fetchDatas = async () => {
    try {
      const response = await fetch("/API/Dashboard/penjualan.json");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const filtered = data.filter((item) => item.tahun === selectedYear);

      if (filtered.length === 0) {
        setIsAvailable(false);
        setDatas([]);
      } else {
        setIsAvailable(true);
        setDatas(filtered);
      }
    } catch (error) {
      console.log("Error mengambil data:", error);
    }
  };

  useEffect(() => {
    if (selectedYear) {
      fetchDatas();
    }
  }, [selectedYear]);

  const barData = () => {
    const labels = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const kategoriTiket = [...new Set(datas.map((item) => item.jenis_tiket))];
    const groupedData = {};

    labels.forEach((bulan) => {
      groupedData[bulan] = {};
      kategoriTiket.forEach((jenis) => {
        groupedData[bulan][jenis] = 0;
      });
    });

    datas.forEach(({ bulan, jenis_tiket, total_tiket_terjual }) => {
      if (groupedData[bulan]) {
        groupedData[bulan][jenis_tiket] += total_tiket_terjual;
      }
    });

    const datasets = kategoriTiket.map((jenis, index) => ({
      label: jenis,
      data: labels.map((bulan) => groupedData[bulan][jenis]),
      backgroundColor: [
        "#BC6C25",
        "#658864",
        "#ECD79B",
        "#ADADAD",
        "#B7B78A",
        "#ECAB9B",
        "#C09E7F",
      ][index],
    }));

    return { labels, datasets };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true },
    },
  };

  return (
    <div className="bg-bg-card rounded-2xl p-4">
      <h1 className="font-semibold text-sm">{t("home.totalPenjualan.title")}</h1>
      {isAvailable ? (
        <div className="w-full h-[300px] mx-auto">
          <Bar data={barData()} options={options} />
        </div>
      ) : (
        <p className="text-center text-sm text-gray-500">
          {t("home.notFound")}
        </p>
      )}
    </div>
  );
};

export default TotalPenjualan;
