"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAuthentication = exports.CreateAccount = void 0;
const MongoUser_1 = __importDefault(require("../Models/MongoUser"));
const handleHash_1 = require("../Handlers/handleHash");
const Cookie_1 = require("../services/Cookie");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const CreateAccount = async (req, res) => {
    const { username, email, password } = req.body;
    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    try {
        const hashedPassword = await (0, handleHash_1.hashPassword)(password);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const existingUser = await MongoUser_1.default.findOne({ $or: [{ email }, { username }] });
        if (!username || !email || !password) {
            return res.status(400).send({ message: "All fields are required" });
        }
        if (!emailRegex.test(email)) {
            return res.status(422).send({ message: "Invalid email format!" });
        }
        if (existingUser) {
            if (existingUser.email === email && existingUser.username === username) {
                return res
                    .status(409)
                    .send({ message: "Email and Username already in use!" });
            }
            else if (existingUser.email === email) {
                return res.status(409).send({ message: "Email already in use!" });
            }
            else if (existingUser.username === username) {
                return res.status(409).send({ message: "Username already in use!" });
            }
        }
        const NewUser = await MongoUser_1.default.create({
            username,
            password: hashedPassword,
            email,
            created_at: currentDate,
        });
        res.status(202).send({ message: "User created successfully!", NewUser });
    }
    catch (err) {
        res.status(500).send({ error: err });
    }
};
exports.CreateAccount = CreateAccount;
const UserAuthentication = async (req, res) => {
    const { username, password } = req.body;
    const userExist = await MongoUser_1.default.findOne({ username });
    if (!userExist) {
        return res.status(400).send({ message: "Username not found!" });
    }
    const isPasswordCorrect = await (0, handleHash_1.verifyPassword)(password, userExist.password);
    if (!isPasswordCorrect) {
        return res.status(400).send({ message: "Password incorrect!" });
    }
    try {
        const cookie = (0, Cookie_1.setCookieToken)(res, userExist.username, userExist.email, userExist.id, userExist.created_at);
        const decodedToken = jsonwebtoken_1.default.decode(cookie);
        res.status(200).send({
            message: "User authenticated successfully",
            decodedToken,
        });
    }
    catch (err) {
        res.status(500).send({ message: "Internal server error" });
    }
};
exports.UserAuthentication = UserAuthentication;
