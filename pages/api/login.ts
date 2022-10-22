import type { NextApiRequest, NextApiResponse } from "next";
import { generateTokens } from "../../utils/generateTokens.server";

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  // Normally the below secrets should be in stored a .env file, but this works for our purposes.
  const ACCESS_TOKEN_SECRET = "54425122-17d9-4991-ae2a-999cd35d92e7";
  const USERNAME = "john.doe";
  const PASSWORD = "wgu1234$";

  if (
    req.method === "POST" &&
    req?.body?.username === USERNAME &&
    req?.body?.password === PASSWORD
  ) {
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
