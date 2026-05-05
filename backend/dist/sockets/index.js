"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSockets = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server_1 = require("../server");
const initializeSockets = (io) => {
    // 1. Authentication Middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error('Authentication error: No token provided'));
        }
        try {
            const secret = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod';
            const decoded = jsonwebtoken_1.default.verify(token, secret);
            socket.data.userId = decoded.userId;
            next();
        }
        catch (err) {
            return next(new Error('Authentication error: Invalid token'));
        }
    });
    io.on('connection', async (socket) => {
        const userId = socket.data.userId;
        console.log(`User connected: ${userId} (Socket: ${socket.id})`);
        // 2. Presence tracking (Connect)
        try {
            await server_1.prisma.user.update({
                where: { id: userId },
                data: { status: 'ONLINE' }
            });
            // Broadcast presence to everyone
            io.emit('presence_update', { userId, status: 'ONLINE' });
        }
        catch (error) {
            console.error(`Failed to update presence for ${userId}:`, error);
        }
        // 3. Room Management
        socket.on('join_rooms', (conversationIds) => {
            if (Array.isArray(conversationIds)) {
                conversationIds.forEach(roomId => {
                    socket.join(roomId);
                });
                console.log(`User ${userId} joined rooms:`, conversationIds);
            }
        });
        // 4. Typing Indicators
        socket.on('typing_start', ({ conversationId }) => {
            if (conversationId) {
                socket.to(conversationId).emit('user_typing', { conversationId, userId });
            }
        });
        socket.on('typing_stop', ({ conversationId }) => {
            if (conversationId) {
                socket.to(conversationId).emit('user_stopped_typing', { conversationId, userId });
            }
        });
        // 5. Presence tracking (Disconnect)
        socket.on('disconnect', async () => {
            console.log(`User disconnected: ${userId} (Socket: ${socket.id})`);
            try {
                await server_1.prisma.user.update({
                    where: { id: userId },
                    data: { status: 'OFFLINE', lastSeen: new Date() }
                });
                io.emit('presence_update', { userId, status: 'OFFLINE' });
            }
            catch (error) {
                console.error(`Failed to update disconnect presence for ${userId}:`, error);
            }
        });
    });
};
exports.initializeSockets = initializeSockets;
