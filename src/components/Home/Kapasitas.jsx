import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import useDarkMode from "../../hooks/useDarkMode";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const Kapasitas = ({ selectedYear }) => {
  const { t } = useTranslation();

  const [datas, setDatas] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);

  const isDark = useDarkMode();

  const fetchDatas = async () => {
    try {
      const response = await fetch("/API/Dashboard/kapasitas.json");
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
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (selectedYear) fetchDatas();
  }, [selectedYear]);

  const radarData = () => {
    if (datas.length === 0) return { labels: [], datasets: [] };

    const ticketTypes = {};

    datas.forEach((item) => {
      const ticketName = item.jenis_tiket;

      if (!ticketTypes[ticketName]) {
        ticketTypes[ticketName] = {
          kapasitas: 0,
          terjual: 0,
        };
      }

      ticketTypes[ticketName].kapasitas += item.kapasitas;
      ticketTypes[ticketName].terjual += item.total_tiket_terjual;
    });

    return {
      labels: Object.keys(ticketTypes),
      datasets: [
        {
          label: "Total Terjual",
          data: Object.values(ticketTypes).map((item) => item.terjual),
          backgroundColor: "rgba(101, 135, 100, 0.5)",
          fill: true,
          borderColor: "#658864",
          borderWidth: 1,
        },
        {
          label: "Kapasitas",
          data: Object.values(ticketTypes).map((item) => item.kapasitas),
          backgroundColor: "rgba(188, 108, 37, 0.5)",
          fill: true,
          borderColor: "#BC6C25",
          borderWidth: 1,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: isDark ? "#FFF" : "#5F5F5F",
        },
      },
    },
    scales: {
      r: {
        pointLabels: {
          color: isDark ? "#FFF" : "#5F5F5F",
        },
        ticks: {
          color: isDark ? "#FFF" : "#5F5F5F",
        },
        grid: {
          color: isDark ? "#444" : "#CCC", 
        },
      },
    },
  };

  return (
    <div className="bg-bg-card dark:bg-dark-mode rounded-2xl px-4 py-4 h-full flex flex-col items-center">
      <h1 className="font-semibold text-sm mb-2 dark:text-white text-label-custom">
        {t("home.kapasitas.title")}
      </h1>
      {isAvailable ? (
        <div className="w-[300px] h-[300px]">
          <Radar data={radarData()} options={options} />
        </div>
      ) : (
        <p className="text-center text-sm text-gray-500">
          {t("home.notFound")}
        </p>
      )}
    </div>
  );
};

export default Kapasitas;
