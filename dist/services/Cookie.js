"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookieToken = void 0;
const JWTokenAuthenticate_1 = require("./JWTokenAuthenticate");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const setCookieToken = (res, username, email, id, created_at) => {
    const token = (0, JWTokenAuthenticate_1.generateToken)(username, email, id, created_at);
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: "/",
    });
    return token;
};
exports.setCookieToken = setCookieToken;
