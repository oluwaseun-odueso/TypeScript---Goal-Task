"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = void 0;
const mysql_1 = __importDefault(require("mysql"));
exports.connection = mysql_1.default.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});
exports.connection.connect(() => {
    console.log('Database has been connected');
});
// module.exports = connection
