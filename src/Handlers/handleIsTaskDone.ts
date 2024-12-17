import { Response, Request } from "express";
import { Task } from "../Models/Task";
import { User } from "../Models/User";
import { isUserOwner } from "../Handlers/handleIsUserOwner";
import { increaseUserPoints } from "../services/RewardSystem";

export const isTaskDone = async (req: Request, res: Response) => {
  const taskId = req.params.taskId;

  try {
    const findTask = await Task.findOne({ where: { task_id: taskId } });

    if (!findTask) {
      return res.status(404).send({ message: "Task doesn't exist" });
    }

    if (findTask.isDone) {
      return res.status(400).send({ message: "Task already marked as done" });
    }

    const checkIn = isUserOwner(req, findTask.user_id);

    if (!checkIn) {
      return res.status(403).send({ message: "You are not the owner" });
    }

    findTask.isDone = true;
    await findTask.save();

    increaseUserPoints(req, res, findTask.user_id, 20);

    return res
      .status(200)
      .send({ message: "Task marked as done successfully" });
  } catch (error) {
    console.error("Error marking task as done:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
};
