import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export const isTokenValid = (accessToken: string) => {
  const ACCESS_TOKEN_SECRET = "54425122-17d9-4991-ae2a-999cd35d92e7";

  if (!accessToken) {
    return false;
  }

  try {
    jwt.verify(accessToken, ACCESS_TOKEN_SECRET); // Throws error if token not verified
  } catch {
    return false;
  }

  return true;
};
