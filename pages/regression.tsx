import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Chart, IChartData } from "../components/Chart";
import { ChartOptions as ICJSChartOptions } from "chart.js";
import {} from "../utils/SessionProvider.client";

export const chartOptions: ICJSChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
    },
    title: {
      display: true,
      text: "Miles Driven vs. Selling Price (USD) - With Linear Regression",
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

const RegressionPage: NextPage = () => {
  const [origData, setOrigData] = useState<{ [key: string]: number }[]>([]);
  const [predictedData, setPredictedData] = useState<
    { [key: string]: number }[]
  >([]);
  const chartData: IChartData = {
    datasets: [
      {
        label: "Actual",
        type: "scatter",
        data: origData,
        borderColor: "rgba(66, 127, 188, 0.5)",
        backgroundColor: "rgba(66, 127, 188, 0.5)",
      },
      {
        label: "Predicted",
        type: "line",
        data: predictedData,
        borderColor: "rgba(244, 191, 44, 0.5)",
        borderWidth: 10,
        backgroundColor: "rgba(244, 191, 44, 0.5)",
        pointRadius: 0,
      },
    ],
  };

  const clearData = async () => {
    setOrigData([]);
    setPredictedData([]);
  };

  const loadData = async () => {
    setOrigData([]);
    setPredictedData([]);
    try {
      const response = await fetch("/api/scatter");
      const { values } = (await response.json()) ?? [];
      setOrigData(values);
    } catch (e) {
      console.log(e);
    }
  };

  const runPrediction = async () => {
    if (!origData?.[0]) {
      setOrigData([]);
    }
    setPredictedData([]);
    try {
      const response = await fetch("/api/regression");
      const { originalPoints, predictedPoints } = (await response.json()) ?? [];
      setTimeout(() => {
        if (!origData?.[0]) {
          setOrigData(originalPoints);
        }
        setPredictedData(predictedPoints);
      }, 250);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <h1>Price Prediction &ndash; Scatter Plot with Linear Regression</h1>
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
            {
              content: "Run Prediction",
              onClick: runPrediction,
              slowAction: true,
            },
          ]}
          chartData={chartData}
          footerComponent="* The prediction algorithm takes some time to run."
          options={chartOptions}
          type="scatter"
        />
      </div>
    </>
  );
};

export default RegressionPage;
