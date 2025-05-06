import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { isWithinInterval, parse } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const BarWaktu = ({ dateRange }) => {
  const { t } = useTranslation();
  const [datas, setDatas] = useState([]);

  const fetchDatas = async () => {
    try {
      const response = await fetch("https://json.sthresearch.site/Income/waktu-kunjungan.json");
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
    const labels = ["Pagi", "Siang", "Sore"];

    const dataPendapatan = labels.map((waktu) => {
      return datas
        .filter((item) => item.waktu_kunjungan === waktu)
        .reduce(
          (total, item) =>
            total + parseInt(item.jumlah_pendapatan.replace(/\./g, "")),
          0
        );
    });

    return {
      labels,
      datasets: [
        {
          label: "Total Pendapatan",
          data: dataPendapatan,
          backgroundColor: "#C09E7F",
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
      <h1 className="font-semibold text-sm">{t("income.time.title")}</h1>
      {datas.length === 0 ? (
        <p className="text-center text-sm text-gray-500">
          {t("income.notFound")}
        </p>
      ) : (
        <div className="h-[300px] w-full py-4">
          <Bar data={barData()} options={options} />
        </div>
      )}
    </div>
  );
};

export default BarWaktu;
