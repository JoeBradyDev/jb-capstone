import Link from "next/link";
import { BiLoaderAlt } from "react-icons/bi";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Chart, IChartData } from "../components/Chart";
import { ChartOptions as ICJSChartOptions } from "chart.js";
import { useRouter } from "next/router";
import { useSession } from "../utils/SessionProvider.client";

const HomePage: NextPage = (props) => {
  return (
    <>
      <div className="w-full">
        <h1>Dashboard</h1>
        <div className="flex w-full justify-center space-x-6 flex-wrap">
          <article className="prose mx-8 mb-8 rounded-lg border-2 border-gray-200 shadow-lg bg-white px-2 pb-2 pt-6">
            <h1>Welcome! You're in the driver's seat!</h1>
            <div className="px-8">
              <p className="lead">
                The{" "}
                <strong>
                  <em>Car Sales Price Prediction Engine</em>
                </strong>{" "}
                will help you set market-appropriate prices using machine
                learning technology.
              </p>
              <p>
                Feel free to take a look around. Here's a few things you can
                check out:
              </p>
              <ul>
                <li>
                  <Link href="/scatter">
                    <a>Mileage vs. Price</a>
                  </Link>
                  : Here you can see a scatter plot of the data used to provide
                  input into our machine learning algorithm.
                </li>
                <li>
                  <Link href="/bar" className="hover:underline">
                    <a>Cars Sold by Price</a>
                  </Link>
                  : This bar graph breaks down sales into various price ranges
                  so you can see what the most common prices are.
                </li>
                <li>
                  <Link href="/pie">
                    <a>Percent Sold by Price</a>
                  </Link>
                  : The pie graph provided here shows percentages for each of
                  the price ranges mentioned in the bar graph.
                </li>
                <li>
                  <strong>
                    <Link href="/regression">
                      <a>Price Prediction</a>
                    </Link>
                  </strong>
                  : The price prediction graph is{" "}
                  <strong>
                    <em>the key graph </em>
                  </strong>
                  of the system, utilizing the linear regression algorithm to
                  provide price estimates.
                  <strong> Make sure to check this out!</strong>
                </li>
              </ul>
            </div>
          </article>
          <div className="w-1/3 flex flex-col">
            <div>
              <div className="rounded-lg border-2 border-gray-200 shadow-lg bg-white overflow-hidden">
                <img src="driver.jpg" />
              </div>
              <div className="px-2 py-1 text-xs text-right text-slate-700">
                Photo by{" "}
                <a
                  className="underline"
                  href="https://unsplash.com/@whykei?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
                >
                  why kei
                </a>{" "}
                on{" "}
                <a
                  className="underline"
                  href="https://unsplash.com/s/photos/car-dashboard?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
                >
                  Unsplash
                </a>
              </div>
            </div>
            <div className="mt-14 text-slate-700">
              <img src="car.svg" />
              <div className="text-right text-xs">
                Image by{" "}
                <a
                  className="underline"
                  href="https://pixabay.com/users/openclipart-vectors-30363/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=160895"
                >
                  OpenClipart-Vectors
                </a>{" "}
                from{" "}
                <a
                  className="underline"
                  href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=160895"
                >
                  Pixabay
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
