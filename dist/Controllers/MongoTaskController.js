"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countUserCompletedTasks = exports.doneTask = exports.updateTask = exports.deleteTask = exports.getTasks = exports.newTask = void 0;
const MongoTask_1 = __importDefault(require("../Models/MongoTask"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const handleIsUserOwner_1 = require("../Handlers/handleIsUserOwner");
const RewardSystem_1 = require("../services/RewardSystem");
const newTask = async (req, res) => {
    const { task, description } = req.body;
    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    try {
        const decodedToken = jsonwebtoken_1.default.decode(req.cookies.token);
        const createTask = await MongoTask_1.default.create({
            task,
            description,
            created_at: currentDate,
            userId: decodedToken.id,
        });
        return res.send({ message: "Task created successful!", createTask });
    }
    catch (err) {
        return res.status(500).send({ message: "Internal server error!", err });
    }
};
exports.newTask = newTask;
const getTasks = async (req, res) => {
    try {
        const decodedToken = jsonwebtoken_1.default.decode(req.cookies.token);
        const getUserTasks = await MongoTask_1.default.find({ userId: decodedToken.id });
        return res.status(200).json({ getUserTasks });
    }
    catch (err) {
        return res.status(500).send({ e: "Internal server error!", err });
    }
};
exports.getTasks = getTasks;
const deleteTask = async (req, res) => {
    const taskId = req.params.taskId;
    try {
        const findTask = await MongoTask_1.default.findOne({ _id: taskId });
        const checkIn = (0, handleIsUserOwner_1.isUserOwner)(req, findTask.userId.toString());
        if (findTask == undefined) {
            return res.send({ message: "This task doesn't exist on database" });
        }
        if (!checkIn) {
            return res.send({ message: "You are not the owner of this task" });
        }
        await MongoTask_1.default.deleteOne({ _id: taskId });
        return res.status(200).send({ message: "Task deleted successful" });
    }
    catch (err) {
        return res.status(500).send({ message: "Internal server error", err });
    }
};
exports.deleteTask = deleteTask;
const updateTask = async (req, res) => {
    const taskId = req.params.taskId;
    const { task, description } = req.body;
    try {
        const findTask = await MongoTask_1.default.findOne({ _id: taskId });
        const checkIn = (0, handleIsUserOwner_1.isUserOwner)(req, findTask.userId.toString());
        if (!findTask) {
            return res.send({ message: "This task doesn't exist on database" });
        }
        if (!checkIn) {
            return res.send({ message: "You are not the owner of this task" });
        }
        task !== undefined
            ? (findTask.task = task)
            : res.send({ message: "Type a new task" });
        description !== undefined
            ? (findTask.description = description)
            : res.send({ message: " Type a new description" });
        await findTask.save();
        return res.send({ message: "Task updated successful" });
    }
    catch (err) {
        return res.status(404).send({ message: "Internal server error!", err });
    }
};
exports.updateTask = updateTask;
const doneTask = async (req, res) => {
    const taskId = req.params.taskId;
    try {
        const findTask = await MongoTask_1.default.findOne({ _id: taskId });
        if (!findTask) {
            return res
                .status(404)
                .send({ message: "Task doesn't exist on database!" });
        }
        if (findTask.isDone) {
            return res.send({ message: "Task already marked as done!" });
        }
        const checkIn = (0, handleIsUserOwner_1.isUserOwner)(req, findTask.userId.toString());
        if (!checkIn) {
            return res.status(403).send({ message: "You are not the owner" });
        }
        findTask.isDone = true;
        await findTask.save();
        const _points = 20;
        (0, RewardSystem_1.increaseUserPoints)(findTask.userId.toString(), 20);
        return res
            .status(200)
            .send({ message: "Task marked as done successfully" });
    }
    catch (err) {
        console.error("Error marking task as done:", err);
        return res.status(500).send({ message: "Internal server error" });
    }
};
exports.doneTask = doneTask;
const countUserCompletedTasks = async (req, res) => {
    const decoded = jsonwebtoken_1.default.decode(req.cookies.token);
    try {
        const completedTasks = await MongoTask_1.default.countDocuments({
            userId: decoded.id,
            isDone: true,
        });
        res.send({ TasksDone: completedTasks });
    }
    catch (err) {
        console.error(err);
    }
};
exports.countUserCompletedTasks = countUserCompletedTasks;
