"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.increaseUserPoints = void 0;
const MongoUser_1 = __importDefault(require("../Models/MongoUser"));
const increaseUserPoints = async (task_owner_id, pointsToAdd) => {
    try {
        const findUser = await MongoUser_1.default.findOne({ _id: task_owner_id });
        if (!findUser) {
            return { success: false, message: "User not found" };
        }
        findUser.points += pointsToAdd;
        await findUser.save();
        return { success: true };
    }
    catch (error) {
        console.error("Error increasing user points:", error);
        return { success: false, message: "Internal server error" };
    }
};
exports.increaseUserPoints = increaseUserPoints;
