"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function MongoConnection() {
    mongoose_1.default
        .connect(process.env.MONGO_DB_CONNECT)
        .then(() => {
        console.log("Mongo Database connected!");
    })
        .catch((err) => {
        console.log("Falha ao conectar: ", err);
    });
}
exports.default = MongoConnection;
