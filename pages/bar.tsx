import { useRouter } from "next/router";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Chart, IChartData } from "../components/Chart";
import { ChartOptions as ICJSChartOptions } from "chart.js";
import { useSession } from "../utils/SessionProvider.client";

export const chartOptions: ICJSChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Cars Sold by Price Range (USD)",
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "Price Ranges (USD)",
      },
    },
    y: {
      max: 1200,
      min: 0,
      title: {
        display: true,
        text: "Cars Sold",
      },
    },
  },
};

const BarPage: NextPage = () => {
  const [data, setData] = useState<number[]>([]);
  const chartData: IChartData = {
    labels: [...Array(7).keys()].map((index) => {
      return `$${!index ? "0" : `${index * 2}k`} - $${index * 2 + 2}k`;
    }),
    datasets: [
      {
        data,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(40, 191, 40, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(40, 191, 38)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const clearData = async () => {
    setData([]);
  };

  const loadData = async () => {
    setData([]);
    try {
      const response = await fetch("/api/bar-and-pie");
      const { values } = (await response.json()) ?? [];
      setData(values);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <h1>Cars Sold by Price</h1>
      <div className="w-full h-full px-28 pt-2">
        <Chart
          actionButtons={[
            {
              content: "Clear Data",
              immediateAction: true,
              inverted: true,
              onClick: clearData,
            },
            {
              content: "Load Data",
              onClick: loadData,
            },
          ]}
          chartData={chartData}
          options={chartOptions}
          type="bar"
        />
      </div>
    </>
  );
};

export default BarPage;
