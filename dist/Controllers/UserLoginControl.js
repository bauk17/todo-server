"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllTasks = exports.LoginUser = exports.createUserAccount = void 0;
const User_1 = require("../Models/User");
const handleHash_1 = require("../Handlers/handleHash");
const Cookie_1 = require("../services/Cookie");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Task_1 = require("../Models/Task");
const createUserAccount = async (req, res) => {
    const { username, email, password } = req.body;
    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    try {
        const emailExist = await User_1.User.findOne({ where: { email: email } });
        const usernameExist = await User_1.User.findOne({ where: { username: username } });
        const hashedPassword = await (0, handleHash_1.hashPassword)(password);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.send({ message: "E-mail inválido" });
        }
        if (emailExist && usernameExist) {
            res.status(400).send({ message: "Email and Username already in use" });
        }
        else if (emailExist) {
            res.status(400).send({ message: "Email already in use" });
        }
        else if (usernameExist) {
            res.status(400).send({ message: "Username already in use" });
        }
        else {
            const NEW_USER = await User_1.User.create({
                username,
                email,
                password: hashedPassword,
                created_at: currentDate,
            });
            res.status(201).send({ message: "User created sucessful!", NEW_USER });
        }
    }
    catch (e) {
        res.send({ error: e });
    }
};
exports.createUserAccount = createUserAccount;
const LoginUser = async (req, res) => {
    const { password, username } = req.body;
    const userExist = await User_1.User.findOne({
        where: { username },
    });
    if (!userExist) {
        return res.status(400).send({ message: "Username not found" });
    }
    const isPasswordCorrect = await (0, handleHash_1.verifyPassword)(password, userExist.password);
    if (!isPasswordCorrect) {
        return res.status(400).send({ message: "Invalid password" });
    }
    try {
        const cookie = (0, Cookie_1.setCookieToken)(res, userExist.username, userExist.email, userExist.id, userExist.created_at);
        const decodedToken = jsonwebtoken_1.default.decode(cookie);
        res
            .status(200)
            .send({ message: "User authenticated sucessful", decodedToken, cookie });
    }
    catch (error) {
        res.status(500).send({ message: "Internal server error" });
    }
};
exports.LoginUser = LoginUser;
const getAllTasks = async (req, res) => {
    const a = await Task_1.Task.findAll();
    res.send(a);
};
exports.getAllTasks = getAllTasks;
