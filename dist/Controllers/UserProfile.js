"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getProfile = async (req, res) => {
    const token = req.cookies.token;
    try {
        const decodedToken = jsonwebtoken_1.default.decode(token);
        res.status(200).send({ message: "User infos", decodedToken });
    }
    catch (error) {
        return res
            .status(403)
            .send({ errorMessage: "Failed to authenticate token" });
    }
};
exports.getProfile = getProfile;
