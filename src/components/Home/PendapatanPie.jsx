import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PendapatanPie = ({ selectedYear }) => {
  const { t } = useTranslation();

  const [datas, setDatas] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);

  const fetchDatas = async () => {
    try {
      const response = await fetch("/API/Dashboard/pendapatan-pie.json");
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
      console.log("Error mengambil data:", error);
    }
  };

  useEffect(() => {
    if (selectedYear) {
      fetchDatas();
    }
  }, [selectedYear]);

  const pieData = () => {
    const ticketTotals = {};

    datas.forEach((item) => {
      const ticketName = item.jenis_tiket;
      const totalPayment = Number(
        item.total_pendapatan.replace(/\./g, "").replace(",", ".")
      );

      if (!ticketTotals[ticketName]) {
        ticketTotals[ticketName] = 0;
      }
      ticketTotals[ticketName] += totalPayment;
    });

    return {
      labels: Object.keys(ticketTotals),
      datasets: [
        {
          data: Object.values(ticketTotals),
          backgroundColor: [
            "#BC6C25",
            "#658864",
            "#ECD79B",
            "#ADADAD",
            "#B7B78A",
            "#ECAB9B",
            "#BC2525",
            "#886664",
          ],
          borderWidth: 0,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
    },
  };
  return (
    <div className="bg-bg-card  rounded-2xl px-4 py-4 h-full">
      <h1 className="font-semibold text-sm">
        {t("home.totalPendapatan.title")}
      </h1>
      {isAvailable ? (
        <div className="w-[300px] h-[300px]">
          <Pie data={pieData()} options={options} />
        </div>
      ) : (
        <p className="text-center text-sm text-gray-500">
          {t("home.totalPendapatan.notFound")}
        </p>
      )}
    </div>
  );
};

export default PendapatanPie;
