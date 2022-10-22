import cookie from "cookie";
import jwt from "jsonwebtoken";

export const generateTokens = (user: any) => {
  // Normally the below secrets should be in stored a .env file, but this works for our purposes.
  const ACCESS_TOKEN_SECRET = "54425122-17d9-4991-ae2a-999cd35d92e7";
  const accessExpiration = 60 * 15;
  const refreshExpiration = 60 * 60;

  const accessToken = jwt.sign(user, ACCESS_TOKEN_SECRET, {
    expiresIn: `${accessExpiration}s`,
  });

  const refreshToken = jwt.sign(user, ACCESS_TOKEN_SECRET, {
    expiresIn: `${refreshExpiration}s`,
  });

  const accessTokenCookie = cookie.serialize("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: accessExpiration,
    path: "/",
  });

  const refreshTokenCookie = cookie.serialize("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: refreshExpiration,
    path: "/",
  });

  return {
    accessTokenCookie,
    accessExpiration,
    refreshTokenCookie,
    refreshExpiration,
  };
};
