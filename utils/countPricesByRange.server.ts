export const countPricesByRange = (data: any) => {
  const values = [...Array(7).keys()].map((index) => {
    const min = index * 2000;
    const max = index * 2000 + 2000;
    return data.filter(({ usdPrice }: any) => usdPrice >= min && usdPrice < max)
      .length;
  });
  return values;
};
