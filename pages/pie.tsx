import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Chart, IChartData } from "../components/Chart";
import { ChartOptions as ICJSChartOptions } from "chart.js";
import {} from "../utils/SessionProvider.client";

const PiePage: NextPage = () => {
  const [data, setData] = useState<number[]>([]);

  const chartOptions: ICJSChartOptions = {
    responsive: true,
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const legendItems = ctx?.chart?.legend?.legendItems;
          const hiddenCountIndexes = !!legendItems?.[0]
            ? legendItems
                .map(({ hidden }, index) => (hidden ? index : null))
                .filter((index) => index !== null)
            : [];
          const origCounts: number[] = (ctx?.dataset?.data as number[]) ?? [];
          const counts = origCounts.filter(
            (count, index) => !hiddenCountIndexes.includes(index)
          );
          if (!!counts) {
            const total =
              counts.length > 1
                ? counts.reduce((a: number, b: number) => a + b, 0)
                : counts[0];
            return ((value / total) * 100).toFixed(1) + "%";
          }

          return "";
        },
      },
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: "Percent of Cars Sold by Price Range (USD)",
      },
    },
  };

  const chartData: IChartData = {
    labels: [...Array(7).keys()].map((index) => {
      return `$${!index ? "0" : `${index * 2}k`} - $${index * 2 + 2}k`;
    }),
    datasets: [
      {
        data,
        datalabels: {
          anchor: "end",
          align: "start",
        },
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
      <div className="w-full max-w-4xl h-full px-28 pt-2">
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
          footerComponent="* Click a range in the legend to remove it and recalculate."
          options={chartOptions}
          type="pie"
        />
      </div>
    </>
  );
};

export default PiePage;
