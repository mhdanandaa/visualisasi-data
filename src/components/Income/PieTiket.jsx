import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { useTranslation } from "react-i18next";
import { parse, isWithinInterval } from "date-fns";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieTiket = ({ dateRange }) => {
  const {t} = useTranslation()
  const [datas, setDatas] = useState([]);

  const fetchDatas = async () => {
    try {
      const response = await fetch("/API/test-pie.json");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      const filtered = data.filter((item) => {
        const itemDate = parse(item.Tanggal, "dd-MM-yyyy HH:mm:ss", new Date());
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
      const jenis = item["Jenis Tiket"];
      const total = Number(item.Total.replace(/\./g, "").replace(",", "."));

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
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
      },
    },
  };

  return (
    <div className="bg-bg-card rounded-2xl px-4 py-4 h-full">
      <h1 className="font-semibold text-sm">
        {t("income.pie.title")}
      </h1>
      {datas.length === 0 ? (
        <p className="text-center text-sm text-gray-500">{t("income.notFound")}</p>
      ) : (
        <div className="w-full h-[300px] pt-4">
          <Pie data={pieData()} options={options} />
        </div>
      )}
    </div>
  );
};

export default PieTiket;
