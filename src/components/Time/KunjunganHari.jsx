import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { isWithinInterval, parse } from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useTranslation } from "react-i18next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const KunjunganHari = ({ dateRange }) => {
  const [datas, setDatas] = useState([]);
  const { t } = useTranslation;

  const fetchDatas = async () => {
    try {
      const response = await fetch(
        "https://json.sthresearch.site/Time/total-kunjungan.json"
      );
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

    const dataKunjungan = labels.map((waktu) => {
      return datas
        .filter((item) => item.waktu_kunjungan === waktu)
        .reduce((total, item) => total + item.total_kunjungan, 0);
    });

    return {
      labels: labels,
      datasets: [
        {
          label: "Total Kunjungan",
          data: dataKunjungan,
          backgroundColor: "#B7B78A",
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
      <h1 className="font-semibold text-sm">{t("time.bar_day.title")}</h1>
      {datas.length === 0 ? (
        <p className="text-center text-sm text-gray-500">
          {t("time.notFound")}
        </p>
      ) : (
        <div className="h-[300px] w-full py-4">
          <Bar data={barData()} options={options} />
        </div>
      )}
    </div>
  );
};

export default KunjunganHari;
