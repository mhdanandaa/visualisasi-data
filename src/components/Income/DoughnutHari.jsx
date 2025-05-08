import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { parse, isWithinInterval } from "date-fns";
import { useTranslation } from "react-i18next";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import useDarkMode from "../../hooks/useDarkMode";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutHari = ({ dateRange }) => {
  const { t } = useTranslation();
  const [datas, setDatas] = useState([]);

  const isDark = useDarkMode()
  const fetchDatas = async () => {
    try {
      const response = await fetch("/API/Income/pendapatan-hari.json");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      const filtered = data.filter((item) => {
        const itemDate = parse(item.Tanggal, "dd-MM-yyyy", new Date());
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

  const doughnutData = () => {
    const totalPendapatan = {
      "Libur Nasional": 0,
      Weekend: 0,
      "Hari Kerja": 0,
    };

    datas.forEach((item) => {
      const kategori = item.kategori_hari;
      const pendapatan = Number(item.total_pendapatan.replace(/\./g, ""));

      if (kategori === "libur_nasional") {
        totalPendapatan["Libur Nasional"] += pendapatan;
      } else if (kategori === "weekend") {
        totalPendapatan["Weekend"] += pendapatan;
      } else if (kategori === "hari_kerja") {
        totalPendapatan["Hari Kerja"] += pendapatan;
      }
    });

    return {
      labels: Object.keys(totalPendapatan),
      datasets: [
        {
          data: Object.values(totalPendapatan),
          label: "Total Pendapatan",
          backgroundColor: ["#BC6C25", "#658864", "#ECD79B"],
          borderWidth: 0,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: isDark ? "#FFF" : "#5F5F5F",
        },
      },
    },
  };

  return (
    <div className="bg-bg-card dark:bg-dark-mode rounded-2xl px-4 py-4 h-full">
      <h1 className="font-semibold text-sm dark:text-white text-label-custom">
        {t("income.doughnut.title")}
      </h1>
      {datas.length === 0 ? (
        <p className="text-center text-sm text-gray-500">
          {t("income.notFound")}
        </p>
      ) : (
        <div className="h-[300px] w-full py-4">
          <Doughnut data={doughnutData()} options={options} />
        </div>
      )}
    </div>
  );
};

export default DoughnutHari;
