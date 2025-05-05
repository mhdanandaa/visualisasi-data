import { isWithinInterval, parse } from "date-fns";
import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const AllPembayaran = ({ dateRange }) => {
  const [datas, setDatas] = useState([]);

  const fetchDatas = async () => {
    try {
      const response = await fetch("https://json.sthresearch.site/Income/jenis-pembayaran.json");
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
    const paymentTotals = {};

    datas.forEach((item) => {
      const jenisPembayaran = item.jenis_pembayaran;
      const total = Number(item.total_pendapatan.replace(/\./g, ""), 0);

      if (!paymentTotals[jenisPembayaran]) {
        paymentTotals[jenisPembayaran] = 0;
      }
      paymentTotals[jenisPembayaran] += total;
    });

    return {
      labels: Object.keys(paymentTotals),
      datasets: [
        {
          data: Object.values(paymentTotals),
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
      <h1 className="font-semibold text-sm">Total Jenis Pembayaran</h1>
      {datas.length === 0 ? (
        <p className="text-center text-sm text-gray-500">Takde</p>
      ) : (
        <div className="w-full h-[300px] pt-4">
          <Pie data={pieData()} options={options} />
        </div>
      )}
    </div>
  );
};

export default AllPembayaran;
