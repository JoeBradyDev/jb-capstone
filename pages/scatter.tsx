import { default as React, ReactDOM } from "react";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Chart, IChartData } from "../components/Chart";
import { ChartOptions as ICJSChartOptions } from "chart.js";
import {} from "../utils/SessionProvider.client";

export const chartOptions: ICJSChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: true,
      text: "Miles Driven vs. Selling Price (USD)",
    },
  },
  scales: {
    x: {
      max: 100_000,
      min: 0,
      ticks: {
        callback: (value) => {
          return typeof value === "number"
            ? value.toLocaleString("en-US") + " mi"
            : value;
        },
      },
      title: {
        display: true,
        text: "Miles Driven",
      },
    },
    y: {
      max: 14_000,
      min: 0,
      ticks: {
        callback: (value) => {
          return typeof value === "number"
            ? value
                .toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })
                .slice(0, -3)
            : value;
        },
      },
      title: {
        display: true,
        text: "Selling Price (USD)",
      },
    },
  },
};

const ScatterPage: NextPage = () => {
  const [data, setData] = useState<{ [key: string]: number }[]>([]);
  const chartData: IChartData = {
    datasets: [
      {
        type: "scatter",
        data: data,
        borderColor: "rgba(66, 127, 188, 0.5)",
        backgroundColor: "rgba(66, 127, 188, 0.5)",
      },
    ],
  };

  const clearData = async () => {
    setData([]);
  };

  const loadData = async () => {
    setData([]);
    try {
      const response = await fetch("/api/scatter");
      const { values } = (await response.json()) ?? [];
      setData(values);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <h1>Mileage vs. Price &ndash; Scatter Plot</h1>
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
          type="scatter"
        />
      </div>
    </>
  );
};

export default ScatterPage;
