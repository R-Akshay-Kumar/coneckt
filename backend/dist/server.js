"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = exports.io = void 0;
const http_1 = require("http");
const app_1 = __importDefault(require("./app"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const sockets_1 = require("./sockets");
dotenv_1.default.config();
const PORT = process.env.PORT || 4000;
const httpServer = (0, http_1.createServer)(app_1.default);
// Initialize Socket.io
exports.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: '*', // TODO: configure for production
        methods: ['GET', 'POST']
    }
});
(0, sockets_1.initializeSockets)(exports.io);
// Initialize Prisma
exports.prisma = new client_1.PrismaClient();
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
