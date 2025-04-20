import { useState, useEffect } from "react";
import IconChart from "../../assets/Chart_Oren.svg";

const TotalPendapatan = () => {
  const [total, setTotal] = useState(0);

  const fetchDatas = async () => {
    try {
      const respone = await fetch("/API/Dashboard/total-pendapatan.json");
      if (!respone.ok) throw new Error();

      const data = await respone.json();
      const totalPendapatan = data.reduce(
        (sum, item) =>
          sum +
          Number(item.total_pendapatan.replace(/\./g, "").replace(",", ".")),
        0
      );
      setTotal(totalPendapatan);
    } catch (error) {
      console.error("Error mengambil data:", error);
    }
  };

  useEffect(() => {
    fetchDatas();
  }, []);

  return (
    <div className="flex flex-col justify-between h-full bg-bg-card rounded-2xl pt-4 pl-4">
      <h1 className="font-normal text-sm">Total Pendapatan</h1>
      <h1 className="font-semibold text-lg">{total.toLocaleString("id-ID")}</h1>
      <div className="flex justify-end items-end">
        <img src={IconChart} className="w-[50%]" />
      </div>
    </div>
  );
};

export default TotalPendapatan;
