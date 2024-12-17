import { User } from "../Models/User";
import { Request, Response } from "express";
import { hashPassword, verifyPassword } from "../Handlers/handleHash";
import { setCookieToken } from "../services/Cookie";
import jwt from "jsonwebtoken";

import { Task } from "../Models/Task";

export const createUserAccount = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");

  try {
    const emailExist = await User.findOne({ where: { email: email } });
    const usernameExist = await User.findOne({ where: { username: username } });
    const hashedPassword = await hashPassword(password);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.send({ message: "E-mail inválido" });
    }
    if (emailExist && usernameExist) {
      res.status(400).send({ message: "Email and Username already in use" });
    } else if (emailExist) {
      res.status(400).send({ message: "Email already in use" });
    } else if (usernameExist) {
      res.status(400).send({ message: "Username already in use" });
    } else {
      const NEW_USER = await User.create({
        username,
        email,
        password: hashedPassword,
        created_at: currentDate,
      });
      res.status(201).send({ message: "User created sucessful!", NEW_USER });
    }
  } catch (e) {
    res.send({ error: e });
  }
};

export const LoginUser = async (req: Request, res: Response) => {
  const { password, username } = req.body;

  const userExist = await User.findOne({
    where: { username },
  });

  if (!userExist) {
    return res.status(400).send({ message: "Username not found" });
  }
  const isPasswordCorrect = await verifyPassword(password, userExist.password);

  if (!isPasswordCorrect) {
    return res.status(400).send({ message: "Invalid password" });
  }

  try {
    const cookie = setCookieToken(
      res,
      userExist.username,
      userExist.email,
      userExist.id,
      userExist.created_at
    );

    const decodedToken = jwt.decode(cookie);

    res
      .status(200)
      .send({ message: "User authenticated sucessful", decodedToken, cookie });
  } catch (error) {
    res.status(500).send({ message: "Internal server error" });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  const a = await Task.findAll();
  res.send(a);
};
