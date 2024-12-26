const express = require("express");
import cors from "cors";
import dotenv from "dotenv";
import { Routes } from "./routes/Routes";
import cookieParser from "cookie-parser";
import MongoConnection from "./mongoDb/mongo";

dotenv.config();

const SERVER = express();

SERVER.use(express.json());

SERVER.use(express.urlencoded({ extended: true }));

SERVER.use(cookieParser());

SERVER.use(cors({ origin: "http://localhost:3000", credentials: true }));

SERVER.use(Routes);

SERVER.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running!`);
});

MongoConnection();
