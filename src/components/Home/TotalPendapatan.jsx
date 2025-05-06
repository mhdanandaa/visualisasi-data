import { useState, useEffect } from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const TotalPendapatan = ({ selectedYear }) => {
  const [datas, setDatas] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchDatas = async () => {
    try {
      const respone = await fetch("https://json.sthresearch.site/Dashboard/total-pendapatan.json");
      if (!respone.ok) throw new Error();

      const data = await respone.json();

      const filtered = data.filter((item) => item.tahun === selectedYear);
      if (filtered.length === 0) {
        setTotal(0);
        setDatas([]);
      } else {
        const totalPendapatan = filtered.reduce(
          (sum, item) => sum + Number(item.total_pendapatan.replace(/\./g, "")),
          0
        );
        setTotal(totalPendapatan);
        setDatas(filtered);
      }
    } catch (error) {
      console.error("Error mengambil data:", error);
    }
  };

  useEffect(() => {
    if (selectedYear) {
      fetchDatas();
    }
  }, [selectedYear]);

  const lineData = () => {
    const dataMap = {};
    datas.forEach((item) => {
      dataMap[item.bulan] = Number(item.total_pendapatan.replace(/\./g, ""));
    });

    const mapping = [
      { label: "Jan", full: "Januari" },
      { label: "Feb", full: "Februari" },
      { label: "Mar", full: "Maret" },
      { label: "Apr", full: "April" },
      { label: "Mei", full: "Mei" },
      { label: "Jun", full: "Juni" },
      { label: "Jul", full: "Juli" },
      { label: "Aug", full: "Agustus" },
      { label: "Sep", full: "September" },
      { label: "Okt", full: "Oktober" },
      { label: "Nov", full: "November" },
      { label: "Des", full: "Desember" },
    ];

    const labels = mapping.map((bulan) => bulan.label);
    const values = mapping.map((bulan) => dataMap[bulan.full] || 0);

    return {
      labels: labels,
      datasets: [
        {
          data: values,
          borderColor: "#658864",
          borderWidth: 2,
          tension: 0.2,
          fill: true,
          backgroundColor: "#EEEEEE",
        },
      ],
    };
  };
  const options = {
    scales: {
      y: {
        beginAtZero: true,
        display: false,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          display: true,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };
  return (
    <div className="flex flex-col justify-between h-full bg-bg-card rounded-2xl pt-4 pl-4">
      <h1 className="font-normal text-sm">Total Pendapatan</h1>
      <h1 className="font-semibold text-lg">Rp. {total.toLocaleString()}</h1>
      <div className="flex justify-end items-end w-3/5 ml-auto rounded-3xl">
        <Line data={lineData()} options={options} />
      </div>
    </div>
  );
};

export default TotalPendapatan;
