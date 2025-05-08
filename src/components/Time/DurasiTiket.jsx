import { useEffect, useState } from "react";
import { isWithinInterval, parse } from "date-fns";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import useDarkMode from "../../hooks/useDarkMode";

ChartJS.register(ArcElement, Tooltip, Legend);

const DurasiTiket = ({ dateRange }) => {
  const [datas, setDatas] = useState([]);

  const isDark = useDarkMode()

  const fetchDatas = async () => {
    try {
      const response = await fetch("/API/Time/durasi-kunjungan.json");
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

  const doughnutData = () => {
    const ticketTotals = {};

    datas.forEach((item) => {
      const jenis = item.jenis_tiket;
      const totalDurasi = item.total_durasi;

      if (!ticketTotals[jenis]) {
        ticketTotals[jenis] = 0;
      }
      ticketTotals[jenis] += totalDurasi;
    });

    return {
      labels: Object.keys(ticketTotals),
      datasets: [
        {
          data: Object.values(ticketTotals),
          label: "Total Durasi Kunjungan",
          backgroundColor: [
            "#BC6C25",
            "#658864",
            "#ECD79B",
            "#ADADAD",
            "#B7B78A",
            "#ECAB9B",
            "#C09E7F",
          ],
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
      tooltip: {
        callbacks: {
          label: function (context) {
            const totalMinutes = context.raw;
            if (totalMinutes >= 60) {
              const hours = Math.floor(totalMinutes / 60);
              const minutes = totalMinutes % 60;
              return `${context.dataset.label}: ${hours} jam${minutes > 0 ? ` ${minutes} menit` : ""}`;
            } else {
              return `${context.dataset.label}: ${totalMinutes} menit`;
            }
          },
        },
      },
    },
  };
  return (
    <div className="bg-bg-card dark:bg-dark-mode rounded-2xl px-4 py-4 h-full">
      <h1 className="font-semibold text-sm text-label-custom dark:text-white">Total Durasi Kunjungan Berdasarkan Jenis Tiket</h1>
      {datas.length === 0 ? (
        <p className="text-center text-sm text-gray-500">alamak takde bg</p>
      ) : (
        <div className="h-[300px] w-full py-4">
          <Doughnut data={doughnutData()} options={options} />
        </div>
      )}
    </div>
  );
};

export default DurasiTiket;
