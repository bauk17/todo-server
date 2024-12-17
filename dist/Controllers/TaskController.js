"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.countUserCompletedTasks = exports.deleteTask = exports.updateTask = exports.getTasks = exports.newTask = void 0;
const Task_1 = require("../Models/Task");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const handleIsUserOwner_1 = require("../Handlers/handleIsUserOwner");
dotenv_1.default.config();
const newTask = async (req, res) => {
    const { task, description } = req.body;
    const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    try {
        const decodedToken = jsonwebtoken_1.default.decode(req.cookies.token);
        const createTask = await Task_1.Task.create({
            task,
            description,
            created_at: currentDate,
            user_id: decodedToken.id,
        });
        return res.send({ message: "Task created successful!", createTask });
    }
    catch (error) {
        return res.status(500).send({ message: "Internal server error!" });
    }
};
exports.newTask = newTask;
const getTasks = async (req, res) => {
    try {
        const decodedToken = jsonwebtoken_1.default.decode(req.cookies.token);
        const getUserTasks = await Task_1.Task.findAll({
            where: { user_id: decodedToken.id },
        });
        return res.status(200).json({ getUserTasks });
    }
    catch (error) {
        return res.status(500).send({ e: "Internal server error!", error });
    }
};
exports.getTasks = getTasks;
const updateTask = async (req, res) => {
    const taskId = req.params.taskId;
    const { task, description } = req.body;
    try {
        const existingTask = await Task_1.Task.findOne({ where: { task_id: taskId } });
        const checkIn = (0, handleIsUserOwner_1.isUserOwner)(req, existingTask?.user_id);
        if (!existingTask) {
            return res.status(404).send({ message: "Task not founded!" });
        }
        if (!checkIn) {
            return res.status(403).send({ message: "You are not the owner" });
        }
        task !== undefined
            ? (existingTask.task = task)
            : res.send({ message: "Type a new task" });
        description !== undefined
            ? (existingTask.description = description)
            : res.send({ message: " Type a new description" });
        await existingTask.save();
        return res.send({ message: "Task updated successful" });
    }
    catch (error) {
        return res.status(404).send({ message: "Internal server error!" });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    const taskId = req.params.taskId;
    try {
        const findTask = await Task_1.Task.findOne({ where: { task_id: taskId } });
        const checkIn = (0, handleIsUserOwner_1.isUserOwner)(req, findTask?.user_id);
        if (findTask == undefined) {
            return res.send({ message: "This task doesn't exist on database" });
        }
        if (!checkIn) {
            return res.send({ message: "You are not the owner of this task" });
        }
        await Task_1.Task.destroy({ where: { task_id: taskId } });
        return res.status(200).send({ message: "Task deleted successful" });
    }
    catch (error) {
        return res.status(500).send({ message: "Internal server error", error });
    }
};
exports.deleteTask = deleteTask;
const countUserCompletedTasks = async (req, res) => {
    const decoded = jsonwebtoken_1.default.decode(req.cookies.token);
    try {
        const completedTasks = await Task_1.Task.count({
            where: {
                user_id: decoded.id,
                isDone: true,
            },
        });
        res.send({ TasksDone: completedTasks });
    }
    catch (err) {
        console.error(err);
    }
};
exports.countUserCompletedTasks = countUserCompletedTasks;
