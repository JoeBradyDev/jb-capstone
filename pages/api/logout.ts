import cookie from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  res.setHeader("Set-Cookie", [
    cookie.serialize("accessToken", "", {
      expires: new Date(0),
      path: "/",
    }),
    cookie.serialize("refreshToken", "", {
      expires: new Date(0),
      path: "/",
    }),
  ]);
  res.status(200).json({ loggedIn: false });
};

export default handler;
