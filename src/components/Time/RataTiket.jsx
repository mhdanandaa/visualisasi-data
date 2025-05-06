import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { parse, isWithinInterval } from "date-fns";
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
const RataTiket = ({ dateRange }) => {
  const [datas, setDatas] = useState([]);
  const { t } = useTranslation();

  const fetchDatas = async () => {
    try {
      const response = await fetch(
        "https://json.sthresearch.site/Time/rata-rata-durasi.json"
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
    const ticketAvg = {};

    datas.forEach((item) => {
      const jenis = item.jenis_tiket;
      const rataDurasi = item.rata_rata;

      if (!ticketAvg[jenis]) {
        ticketAvg[jenis] = 0;
      }
      ticketAvg[jenis] += rataDurasi;
    });

    return {
      labels: Object.keys(ticketAvg),
      datasets: [
        {
          label: "Rata-Rata Durasi Per Jenis Tiket",
          data: Object.values(ticketAvg),
          backgroundColor: ["#ECD79B"],
          borderWidth: 0,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "x",
    plugins: {
      legend: {
        position: "top",
      },
    },
  };
  return (
    <div className="bg-bg-card rounded-2xl px-4 py-4 h-full">
      <h1 className="font-semibold text-sm">{t("time.avg_ticket.title")}</h1>
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

export default RataTiket;
