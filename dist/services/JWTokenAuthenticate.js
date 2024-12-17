"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyTokenMiddleware = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const SECRET_KEY = process.env.SECRET_JSON_KEY;
const generateToken = (username, email, id, created_at) => {
    return jsonwebtoken_1.default.sign({ username, email, id, created_at }, SECRET_KEY, {
        expiresIn: "720h",
    });
};
exports.generateToken = generateToken;
const verifyTokenMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send({ message: "Token was not provided!" });
    }
    try {
        const verifyToken = jsonwebtoken_1.default.verify(token, process.env.SECRET_JSON_KEY);
        next();
    }
    catch (error) {
        return res.status(403).send({ message: "Failed to authenticate token" });
    }
};
exports.verifyTokenMiddleware = verifyTokenMiddleware;
