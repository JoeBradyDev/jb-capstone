import cookie from "cookie";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { generateTokens } from "../../utils/generateTokens.server";
import { isTokenValid } from "../../utils/isTokenValid.server";

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const { refreshToken } = cookie.parse(req.headers.cookie ?? "");
  if (isTokenValid(refreshToken)) {
    const user = {
      userId: "john.doe",
      name: "John Doe",
    };

    const { accessTokenCookie, accessExpiration, refreshTokenCookie } =
      generateTokens(user);

    res.setHeader("Set-Cookie", [accessTokenCookie, refreshTokenCookie]);

    res
      .status(200)
      .json({ user, loggedIn: true, tokenExpiration: accessExpiration });
  } else {
    res
      .status(401)
      .json({ message: "You are not authorized to access this resource." });
  }
};

export default handler;
