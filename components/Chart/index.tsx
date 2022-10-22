import { BiLoaderAlt as LoaderIcon } from "react-icons/bi";
import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartDataset,
  ChartTypeRegistry,
  ChartOptions as ICJSChartOptions,
} from "chart.js";
import { Chart as RCJS2Chart, Line, Scatter } from "react-chartjs-2";
import { ActionButtons, IActionButton } from "../ActionButtons";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  ArcElement,
  CategoryScale,
  ChartDataLabels,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export interface IChartData {
  labels?: string[];
  datasets:
    | ChartDataset<
        keyof ChartTypeRegistry,
        { [key: string]: number }[] | number[]
      >[];
}

export interface IChartProps {
  actionButtons: IActionButton[];
  chartData: IChartData;
  footerComponent?: React.ReactNode;
  options: ICJSChartOptions;
  type: "scatter" | "line" | "pie" | "bar";
}

export const Chart: React.FC<IChartProps> = ({
  actionButtons,
  chartData,
  footerComponent,
  options: chartOptions,
  type,
}) => {
  const [loading, setLoading] = useState(false);
  const [loaderShowing, setLoaderShowing] = useState(false);
  const [loaderRemovedFromPage, setLoaderRemovedFromPage] = useState(true);
  const disableButtons = loading || loaderShowing || !loaderRemovedFromPage;

  let options = chartOptions;

  if (!options?.plugins) {
    options.plugins = {};
  }

  if (!options.plugins?.datalabels) {
    options.plugins.datalabels = {};
  }

  if (type === "scatter") {
    options.plugins.datalabels.display = false;
  }

  const handleClick = (
    onClick?: () => void,
    slowAction?: boolean,
    immediateAction?: boolean
  ) => {
    if (!onClick) {
      return;
    }

    const actionDelay = !immediateAction ? 100 : 0;
    const hideLoaderDelay = !slowAction ? 1000 : 2000;
    const removeLoaderDelay = !slowAction ? 1500 : 2500;

    if (!immediateAction) {
      setLoading(true);
      setLoaderRemovedFromPage(false);
    }

    setTimeout(async () => {
      if (!immediateAction) {
        setLoaderShowing(true);
      }
      try {
        await onClick();
      } catch (e) {
        console.log(e);
      } finally {
        if (!immediateAction) {
          setLoading(false);
          setTimeout(() => {
            setLoaderShowing(false);
          }, 1000);
          setTimeout(() => {
            setLoaderRemovedFromPage(true);
          }, removeLoaderDelay);
        }
      }
    }, actionDelay);
  };

  return (
    <>
      <div className="bg-white relative p-2 m-2 rounded-lg border-2 border-gray-200 shadow-lg overflow-hidden">
        <div
          className={`transition transition-opacity ease-linear ${
            loaderShowing ? "opacity-100" : "opacity-0"
          } ${loaderRemovedFromPage ? "hidden" : ""}`}
        >
          <div className="absolute inset-0 border w-full h-full">
            <div className="absolute opacity-25 bg-slate-400 w-full h-full rounded transition transition-opacity" />
            <div className="flex justify-center h-full w-full items-center">
              <LoaderIcon className="animate-spin h-12 w-12 text-indigo-600" />
            </div>
          </div>
        </div>
        <RCJS2Chart type={type} data={chartData} options={options} />
      </div>
      <div className="flex justify-between mt-6 pr-2 pl-4 items-center">
        <div className="w-full text-gray-600">{footerComponent}</div>
        <ActionButtons
          buttons={actionButtons.map((button) => ({
            ...button,
            disabled: disableButtons,
            onClick: () =>
              handleClick(
                button?.onClick,
                button?.slowAction,
                button?.immediateAction
              ),
          }))}
          className="full flex justify-end self-start"
        />
      </div>
    </>
  );
};
