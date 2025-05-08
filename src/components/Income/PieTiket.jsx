import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { parse, isWithinInterval } from "date-fns";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import useDarkMode from "../../hooks/useDarkMode";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieTiket = ({ dateRange }) => {
  const { t } = useTranslation();
  const [datas, setDatas] = useState([]);
  const isDark = useDarkMode()


  const fetchDatas = async () => {
    try {
      const response = await fetch("/API/Income/pendapatan-tiket.json");
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

  const pieData = () => {
    const ticketTotals = {};

    datas.forEach((item) => {
      const jenis = item.jenis_tiket;
      const total = Number(item.total_pendapatan.replace(/\./g, ""),0);

      if (!ticketTotals[jenis]) {
        ticketTotals[jenis] = 0;
      }
      ticketTotals[jenis] += total;
    });

    return {
      labels: Object.keys(ticketTotals),
      datasets: [
        {
          data: Object.values(ticketTotals),
          label: "Total Pendapatan",
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
    },
  };

  return (
    <div className="bg-bg-card dark:bg-dark-mode rounded-2xl px-4 py-4 h-full">
      <h1 className="font-semibold text-sm dark:text-white text-label-custom">{t("income.pie.title")}</h1>
      {datas.length === 0 ? (
        <p className="text-center text-sm text-gray-500">
          {t("income.notFound")}
        </p>
      ) : (
        <div className="w-full h-[300px] pt-4">
          <Pie data={pieData()} options={options} />
        </div>
      )}
    </div>
  );
};

export default PieTiket;
