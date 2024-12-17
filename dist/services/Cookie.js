"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setCookieToken = void 0;
const JWTokenAuthenticate_1 = require("./JWTokenAuthenticate");
const setCookieToken = (res, username, email, id, created_at) => {
    const token = (0, JWTokenAuthenticate_1.generateToken)(username, email, id, created_at);
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return token;
};
exports.setCookieToken = setCookieToken;
