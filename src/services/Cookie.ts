import { generateToken } from "./JWTokenAuthenticate";
import { Request, Response } from "express";

export const setCookieToken = (
  res: Response,
  username: string,
  email: string,
  id: number,
  created_at: Date
) => {
  const token = generateToken(username, email, id, created_at);

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  return token;
};
