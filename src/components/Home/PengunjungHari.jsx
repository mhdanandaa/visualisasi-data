import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
import { set } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PengunjungHari = ({ selectedYear }) => {
  const { t } = useTranslation();

  const [datas, setDatas] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);

  const fetchDatas = async () => {
    try {
      const response = await fetch("/API/Dashboard/libur.json");
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
    const totalPengunjung = {
      "Libur Nasional": 0,
      Weekend: 0,
      "Hari Kerja": 0,
    };

    datas.forEach((item) => {
      totalPengunjung["Libur Nasional"] += item.total_pengunjung_libur_nasional;
      totalPengunjung["Weekend"] += item.total_pengunjung_weekend;
      totalPengunjung["Hari Kerja"] += item.total_pengunjung_hari_kerja;
    });

    return {
      labels: Object.keys(totalPengunjung),
      datasets: [
        {
          label: "Total Pengunjung",
          data: Object.values(totalPengunjung),
          backgroundColor: "#6B8E5E",
          borderWidth: 1,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div className="bg-bg-card rounded-2xl px-4 py-4 h-full">
      <h1 className="font-semibold text-sm">
        {t("home.totalPengunjung.title")}
      </h1>
      {isAvailable ? (
        <div className="h-[300px] w-full py-4">
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

export default PengunjungHari;
