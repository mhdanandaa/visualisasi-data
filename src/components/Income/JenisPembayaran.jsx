import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { isWithinInterval, parse } from "date-fns";
import { useTranslation } from "react-i18next";
import useDarkMode from "../../hooks/useDarkMode";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TotalPenjualan = ({ dateRange }) => {
  const { t } = useTranslation();
  const [datas, setDatas] = useState([]);

  const isDark = useDarkMode();

  useEffect(() => {
    const fetchDatas = async () => {
      try {
        const response = await fetch("/API/Income/jenis-pembayaran.json");
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
    fetchDatas();
  }, [dateRange]);

  const stackedData = () => {
    const pembayaranLabels = [
      ...new Set(datas.map((item) => item.jenis_pembayaran)),
    ];
    const tiketLabels = [...new Set(datas.map((item) => item.jenis_tiket))];

    const groupedData = {};
    pembayaranLabels.forEach((pembayaran) => {
      groupedData[pembayaran] = {};
      tiketLabels.forEach((tiket) => {
        groupedData[pembayaran][tiket] = 0;
      });
    });

    datas.forEach(({ jenis_pembayaran, jenis_tiket, total_pendapatan }) => {
      groupedData[jenis_pembayaran][jenis_tiket] += parseInt(
        total_pendapatan.replace(/\./g, ""),
        10
      );
    });

    const datasets = tiketLabels.map((tiket, index) => ({
      label: tiket,
      data: pembayaranLabels.map(
        (pembayaran) => groupedData[pembayaran][tiket]
      ),
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

    return { labels: pembayaranLabels, datasets };
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
      x: { 
        stacked: true,
        ticks: {
          color: isDark ? "#FFF" : "#5F5F5F",
        },
        grid: {
          color: isDark ? "#444" : "#CCC",
        },
       },
      y: { 
        stacked: true,
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
    <div className="bg-bg-card dark:bg-dark-mode rounded-2xl p-4">
      <h1 className="font-semibold text-sm dark:text-white text-label-custom">
        {t("income.payment.title")}
      </h1>
      {datas.length === 0 ? (
        <p className="text-center text-sm text-gray-500">
          {t("income.notFound")}
        </p>
      ) : (
        <div className="w-full h-[300px] mx-auto">
          <Bar data={stackedData()} options={options} />
        </div>
      )}
    </div>
  );
};

export default TotalPenjualan;
