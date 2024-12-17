"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTaskDone = void 0;
const Task_1 = require("../Models/Task");
const handleIsUserOwner_1 = require("../Handlers/handleIsUserOwner");
const RewardSystem_1 = require("../services/RewardSystem");
const isTaskDone = async (req, res) => {
    const taskId = req.params.taskId;
    try {
        const findTask = await Task_1.Task.findOne({ where: { task_id: taskId } });
        if (!findTask) {
            return res.status(404).send({ message: "Task doesn't exist" });
        }
        if (findTask.isDone) {
            return res.status(400).send({ message: "Task already marked as done" });
        }
        const checkIn = (0, handleIsUserOwner_1.isUserOwner)(req, findTask.user_id);
        if (!checkIn) {
            return res.status(403).send({ message: "You are not the owner" });
        }
        findTask.isDone = true;
        await findTask.save();
        (0, RewardSystem_1.increaseUserPoints)(req, res, findTask.user_id, 20);
        return res
            .status(200)
            .send({ message: "Task marked as done successfully" });
    }
    catch (error) {
        console.error("Error marking task as done:", error);
        return res.status(500).send({ message: "Internal server error" });
    }
};
exports.isTaskDone = isTaskDone;
