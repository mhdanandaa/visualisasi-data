import { isWithinInterval, parse } from "date-fns";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useTranslation } from "react-i18next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const JamMasukTiket = ({ dateRange }) => {
  const [datas, setDatas] = useState([]);
  const { t } = useTranslation;

  const fetchDatas = async () => {
    try {
      const response = await fetch(
        "https://json.sthresearch.site/Time/jam-masuk.json"
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

  const lineData = () => {
    const allJam = Array.from(new Set(datas.map((item) => item.jam_grup))).sort(
      (a, b) => a - b
    );

    const ticketTotals = {};

    datas.forEach((item) => {
      const jenis = item.jenis_tiket;
      const totalPengunjung = item.jumlah_pengunjung;
      const jamMasuk = item.jam_grup;

      if (!ticketTotals[jenis]) {
        ticketTotals[jenis] = {};
      } else if (!ticketTotals[jenis][jamMasuk]) {
        ticketTotals[jenis][jamMasuk] = 0;
      }
      ticketTotals[jenis][jamMasuk] += totalPengunjung;
    });

    const lineColors = [
      "#BC6C25",
      "#658864",
      "#ECD79B",
      "#ADADAD",
      "#B7B78A",
      "#ECAB9B",
      "#C09E7F",
    ];

    const bgColor = [
      "rgba(188, 108, 37, 0.2)",
      "rgba(101, 136, 100, 0.2)",
      "rgba(236, 215, 155, 0.2)",
      "rgba(173, 173, 173, 0.2)",
      "rgba(155, 202, 236, 0.2)",
      "rgba(183, 183, 138, 0.2)",
      "rgba(236, 171, 155, 0.2)",
      "rgba(192, 158, 127, 0.2)",
    ];
    const datasets = Object.keys(ticketTotals).map((jenis, index) => ({
      label: jenis,
      data: allJam.map((jam) => ticketTotals[jenis][jam] || 0),
      borderColor: lineColors[index % lineColors.length],
      borderWidth: 2,
      backgroundColor: bgColor[index % bgColor.length],
      tension: 0.1,
      fill: true,
    }));
    return {
      labels: allJam.map((jam) => `${jam}:00`),
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
      <h1 className="font-semibold text-sm">{t("time.line.title")}</h1>
      {datas.length === 0 ? (
        <p className="text-center text-sm text-gray-500">
          {t("time.notFound")}
        </p>
      ) : (
        <div className="h-[300px] w-full py-4">
          <Line data={lineData()} options={options} />
        </div>
      )}
    </div>
  );
};

export default JamMasukTiket;
