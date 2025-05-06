import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { parse, isWithinInterval } from "date-fns";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useTranslation } from "react-i18next";

ChartJS.register(ArcElement, Tooltip, Legend);

const DurasiHari = ({ dateRange }) => {
  const [datas, setDatas] = useState([]);
  const { t } = useTranslation;

  const fetchDatas = async () => {
    try {
      const response = await fetch(
        "https://json.sthresearch.site/Time/durasi-hari.json"
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

  const pieData = () => {
    const totalDurasi = {
      Senin: 0,
      Selasa: 0,
      Rabu: 0,
      Kamis: 0,
      Jumat: 0,
      Sabtu: 0,
      Minggu: 0,
    };

    datas.forEach((item) => {
      const hari = item.hari;
      const durasi = item.total_durasi;

      if (hari === "Senin") {
        totalDurasi["Senin"] += durasi;
      } else if (hari === "Selasa") {
        totalDurasi["Selasa"] += durasi;
      } else if (hari === "Rabu") {
        totalDurasi["Rabu"] += durasi;
      } else if (hari === "Kamis") {
        totalDurasi["Kamis"] += durasi;
      } else if (hari === "Jumat") {
        totalDurasi["Jumat"] += durasi;
      } else if (hari === "Sabtu") {
        totalDurasi["Sabtu"] += durasi;
      } else if (hari === "Minggu") {
        totalDurasi["Minggu"] += durasi;
      }
    });

    return {
      labels: Object.keys(totalDurasi),
      datasets: [
        {
          data: Object.values(totalDurasi),
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
      },
    },
  };
  return (
    <div className="bg-bg-card rounded-2xl px-4 py-4 h-full">
      <h1 className="font-semibold text-sm">{t("time.pie_visitors.title")}</h1>
      {datas.length === 0 ? (
        <p className="text-center text-sm text-gray-500">
          {t("time.notFound")}
        </p>
      ) : (
        <div className="w-full h-[300px] pt-4">
          <Pie data={pieData()} options={options} />
        </div>
      )}
    </div>
  );
};

export default DurasiHari;
