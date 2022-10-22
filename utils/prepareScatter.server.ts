export const prepareScatter = (data: any) => {
  const values = data.map((car: any) => ({
    ...car,
    x: car.miDriven,
    y: car.usdPrice,
  }));
  return values;
};
