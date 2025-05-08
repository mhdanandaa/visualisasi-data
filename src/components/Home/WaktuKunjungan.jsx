import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJs,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJs.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const WaktuKunjungan = ({ selectedYear }) => {
  const { t } = useTranslation();

  const [datas, setDatas] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);

  const fetchDatas = async () => {
    try {
      const respone = await fetch("/API/Dashboard/waktu-kunjungan.json");
      if (!respone.ok) throw new Error(`HTTP error! status: ${respone.status}`);

      const data = await respone.json();
      const filtered = data.filter((item) => item.tahun === selectedYear);

      if (filtered.length === 0) {
        setIsAvailable(false);
        setDatas([]);
      } else {
        setIsAvailable(true);
        setDatas(filtered);
      }
    } catch (error) {
      console.log("Error mengambil data", error);
    }
  };

  useEffect(() => {
    if (selectedYear) {
      fetchDatas();
    }
  }, [selectedYear]);

  const polarData = () => {
    const timeCategory = {};

    datas.forEach((item) => {
      const timeVisit = item.kategori_kunjungan;
      const totalSell = item.jumlah_terjual

      if (!timeCategory[timeVisit]) {
        timeCategory[timeVisit] = 0;
      }
      timeCategory[timeVisit] = +totalSell;
    });

    return {
      labels: Object.keys(timeCategory),
      datasets: [
        {
          data: Object.values(timeCategory),
          label: "Total Pengunjung",
          backgroundColor: ["#BC6C25", "#658864", "#ECD79B"],
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
        {t("home.waktuKunjungan.title")}
      </h1>
      {isAvailable ? (
        <div className="h-[300px] w-ful py-4">
          <PolarArea data={polarData()} options={options} />
        </div>
      ) : (
        <p className="text-center text-sm text-gray-500">
          {t("home.notFound")}
        </p>
      )}
    </div>
  );
};

export default WaktuKunjungan;
