import { Task } from "../Models/Task";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../Models/User";
import { isUserOwner } from "../Handlers/handleIsUserOwner";

dotenv.config();

export const newTask = async (req: Request, res: Response) => {
  const { task, description } = req.body;
  const currentDate = new Date().toISOString().slice(0, 19).replace("T", " ");

  try {
    const decodedToken: any = jwt.decode(req.cookies.token);

    const createTask = await Task.create({
      task,
      description,
      created_at: currentDate,
      user_id: decodedToken.id,
    });

    return res.send({ message: "Task created successful!", createTask });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error!" });
  }
};

export const getTasks = async (req: Request, res: Response) => {
  try {
    const decodedToken: any = jwt.decode(req.cookies.token);
    const getUserTasks = await Task.findAll({
      where: { user_id: decodedToken.id },
    });

    return res.status(200).json({ getUserTasks });
  } catch (error) {
    return res.status(500).send({ e: "Internal server error!", error });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const taskId = req.params.taskId;
  const { task, description } = req.body;

  try {
    const existingTask = await Task.findOne({ where: { task_id: taskId } });
    const checkIn = isUserOwner(req, existingTask?.user_id);

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
  } catch (error) {
    return res.status(404).send({ message: "Internal server error!" });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const taskId = req.params.taskId;

  try {
    const findTask = await Task.findOne({ where: { task_id: taskId } });
    const checkIn = isUserOwner(req, findTask?.user_id);
    if (findTask == undefined) {
      return res.send({ message: "This task doesn't exist on database" });
    }
    if (!checkIn) {
      return res.send({ message: "You are not the owner of this task" });
    }

    await Task.destroy({ where: { task_id: taskId } });

    return res.status(200).send({ message: "Task deleted successful" });
  } catch (error) {
    return res.status(500).send({ message: "Internal server error", error });
  }
};

export const countUserCompletedTasks = async (req: Request, res: Response) => {
  const decoded: any = jwt.decode(req.cookies.token);

  try {
    const completedTasks = await Task.count({
      where: {
        user_id: decoded.id,
        isDone: true,
      },
    });

    res.send({ TasksDone: completedTasks });
  } catch (err) {
    console.error(err);
  }
};
