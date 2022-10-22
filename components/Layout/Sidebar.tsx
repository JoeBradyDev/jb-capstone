import { AiOutlineDashboard as DashboardIcon } from "react-icons/ai";
import { VscGraphScatter as ScatterIcon } from "react-icons/vsc";
import { GoLightBulb as LightBulbIcon } from "react-icons/go";
import { BiDollar as DollarIcon } from "react-icons/bi";
import { FiPercent as PercentIcon } from "react-icons/fi";
import Link from "next/link";

export interface IIconProps {
  className: string;
}

export interface IPage {
  Icon: React.FC<IIconProps>;
  label: string;
  page: string;
  transparentFill?: boolean;
}

export interface ISidebarProps {
  pathname: string;
}

export const Sidebar: React.FC<ISidebarProps> = ({ pathname }) => {
  const pages: IPage[] = [
    {
      Icon: DashboardIcon,
      label: "Dashboard",
      page: "/",
    },
    {
      Icon: ScatterIcon,
      label: "Mileage vs. Price",
      page: "/scatter",
    },
    {
      Icon: DollarIcon,
      label: "Cars Sold by Price",
      page: "/bar",
    },
    {
      Icon: PercentIcon,
      label: "Percent Sold by Price",
      page: "/pie",
      transparentFill: true,
    },
    {
      Icon: LightBulbIcon,
      label: "Price Prediction",
      page: "/regression",
    },
  ];

  return (
    <div className="fixed left-0 top-20 bg-gradient-to-bl from-slate-600 to-slate-700 h-full w-96 border-r-4 border-indigo-900 flex flex-col px-4 py-4">
      {pages.map(({ Icon, label, page, transparentFill }) => {
        const selected = page === pathname;
        return (
          <Link href={page} key={page}>
            <a
              className={`text-slate-100 hover:text-violet-50 flex items-center py-4 -mx-4 px-4 ${
                selected
                  ? "bg-gradient-to-r from-violet-600 via-violet-600 to-violet-400 shadow-md border-t border-violet-500"
                  : "hover:bg-gradient-to-r hover:from-violet-700 hover:via-violet-700 hover:to-violet-600"
              }`}
            >
              <Icon
                className={`mr-4 h-6 w-6 stroke-slate-100 drop-shadow-md ${
                  transparentFill ? "fill-transparent" : "fill-slate-100"
                }`}
              />
              <div
                className={`text-xl drop-shadow-md ${
                  selected ? "font-medium" : ""
                }`}
              >
                {label}
              </div>
            </a>
          </Link>
        );
      })}
    </div>
  );
};
