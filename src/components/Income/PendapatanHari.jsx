import { isWithinInterval, parse } from "date-fns";
import { useEffect, useState } from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PendapatanHari = ({ dateRange }) => {
  const [datas, setDatas] = useState([]);

  const fetchDatas = async () => {
    try {
      const response = await fetch("/API/Income/pendapatan-jenis-hari.json");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      const endOfDay = new Date(dateRange.endDate);
      endOfDay.setHours(23, 59, 59, 999);

      const filtered = data.filter((item) => {
        const itemDate = parse(item.tanggal, "dd-MM-yyyy", new Date());
        return isWithinInterval(itemDate, {
          start: dateRange.startDate,
          end: endOfDay,
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
    const labels = [
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
      "Minggu",
    ];
    const dataPendapatan = labels.map((hari) => {
      return datas
        .filter((item) => item.hari === hari)
        .reduce(
          (total, item) =>
            total + parseInt(item.total_pendapatan.replace(/\./g, "")),
          0
        );
    });

    return {
      labels,
      datasets: [
        {
          data: dataPendapatan,
          label: "Total Pendapatan",
          backgroundColor: ["#ECAB9B"],
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
      <h1 className="font-semibold text-sm">Total Pendapatan Berdasarkan Hari</h1>
      {datas.length === 0 ? (
        <p className="text-center text-sm text-gray-500">Takde</p>
      ) : (
        <div className="w-full h-[300px] pt-4">
          <Bar data={barData()} options={options} />
        </div>
      )}
    </div>
  );
};

export default PendapatanHari;
