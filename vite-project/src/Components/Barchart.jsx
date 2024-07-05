import React, { useMemo } from "react";
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

const Barchart = ({ data, selectedMonth }) => {
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const saleDate = new Date(item.dateOfSale);
      return saleDate.toLocaleString('default', { month: 'long' }) === selectedMonth;
    });
  }, [data, selectedMonth]);

  const priceRanges = useMemo(() => {
    const ranges = {
      "0-100": 0,
      "101-200": 0,
      "201-300": 0,
      "301-400": 0,
      "401-500": 0,
      "500+": 0,
    };

    filteredData.forEach((item) => {
      const price = item.price;
      if (price <= 100) ranges["0-100"]++;
      else if (price <= 200) ranges["101-200"]++;
      else if (price <= 300) ranges["201-300"]++;
      else if (price <= 400) ranges["301-400"]++;
      else if (price <= 500) ranges["401-500"]++;
      else ranges["500+"]++;
    });

    return ranges;
  }, [filteredData]);

  const chartData = {
    labels: Object.keys(priceRanges),
    datasets: [
      {
        label: "Number of Items",
        data: Object.values(priceRanges),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Price Range Distribution for ${selectedMonth}`,
      },
    },
  };

  return (
    <div>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default Barchart;
