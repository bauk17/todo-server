"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const express_1 = __importDefault(require("express"));
const UserProfileController = __importStar(require("../Controllers/UserProfile"));
const MongoUserController = __importStar(require("../Controllers/MongoUserController"));
const MongoTaskController = __importStar(require("../Controllers/MongoTaskController"));
const JWTokenAuthenticate_1 = require("../services/JWTokenAuthenticate");
exports.Routes = express_1.default.Router();
// User Authentication
exports.Routes.get("/", (req, res) => {
    res.send({ message: "It's working" });
});
// Mongo DB
exports.Routes.post("/createAccount", MongoUserController.CreateAccount);
exports.Routes.post("/login", MongoUserController.UserAuthentication);
exports.Routes.get("/userProfile", JWTokenAuthenticate_1.verifyTokenMiddleware, UserProfileController.getProfile);
exports.Routes.post("/logout", JWTokenAuthenticate_1.verifyTokenMiddleware, (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
    });
    res.status(200).send({ message: "User logged out successfully!" });
});
// Task Management Mongo DB - Everything already working
exports.Routes.post("/newTask", JWTokenAuthenticate_1.verifyTokenMiddleware, MongoTaskController.newTask);
exports.Routes.get("/getTasks", JWTokenAuthenticate_1.verifyTokenMiddleware, MongoTaskController.getTasks);
exports.Routes.delete("/deleteTask/:taskId", JWTokenAuthenticate_1.verifyTokenMiddleware, MongoTaskController.deleteTask);
exports.Routes.put("/changeTask/:taskId", JWTokenAuthenticate_1.verifyTokenMiddleware, MongoTaskController.updateTask);
exports.Routes.get("/countCompletedTasks", JWTokenAuthenticate_1.verifyTokenMiddleware, MongoTaskController.countUserCompletedTasks);
exports.Routes.put("/doneTask/:taskId", JWTokenAuthenticate_1.verifyTokenMiddleware, MongoTaskController.doneTask);
exports.Routes.get("/check-auth", (req, res) => {
    if (req.cookies.token) {
        res.status(200).send({ message: "Authenticated!" });
    }
    else {
        res.status(401).send({ error: "Unauthorized" });
    }
});
