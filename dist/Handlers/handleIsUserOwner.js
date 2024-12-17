"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserOwner = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isUserOwner = (req, task_owner_id) => {
    const decodedToken = jsonwebtoken_1.default.decode(req.cookies.token);
    const userRequesting = decodedToken.id;
    if (userRequesting !== task_owner_id) {
        return false;
    }
    return true;
};
exports.isUserOwner = isUserOwner;
