import cookie from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";
import { loadData } from "../../utils/loadData.server";
import { countPricesByRange } from "../../utils/countPricesByRange.server";
import { isTokenValid } from "../../utils/isTokenValid.server";

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const { accessToken } = cookie.parse(req.headers.cookie ?? "");
  if (isTokenValid(accessToken)) {
    const data = await loadData();
    const values = countPricesByRange(data);
    res.status(200).json({ data, values });
  } else {
    res
      .status(401)
      .json({ message: "You are not authorized to access this resource." });
  }
};

export default handler;
