import csv from "csvtojson";

export const convertINRtoUSD = async (rupees: number) => {};

export const convertKMtoMI = (km: number) => {
  // Convert Kilometers to Miles since distance is recorded in Kilometers
  const mi = Math.round(km / 1.609);
};

export const loadData = async () => {
  // Load data from csv.
  const cars = await csv().fromFile("./used_car_data.csv");

  // Clean and format data.
  const cleanedData = cars
    // Remove any data points without both distance driven and selling price.
    .filter(({ km_driven, selling_price }) => !!km_driven && !!selling_price)
    // Select only relevant data attributes (distance driven & selling price).
    .map(({ km_driven, name, selling_price, year }) => ({
      // Convert Kilometers to Miles since distance is recorded in Kilometers.
      miDriven: Math.round(Number(km_driven) / 1.609),
      // Convert Indian Rupee to US Dollar since currency is recorded in Indian Rupees.
      usdPrice: Math.round(Number(selling_price) * 0.012),
    }))
    // Remove any irrelevant outliers (price or mileage excessively high).
    .filter(
      ({ miDriven, usdPrice }) => miDriven < 100_000 && usdPrice < 14_000
    );

  return cleanedData;
};
