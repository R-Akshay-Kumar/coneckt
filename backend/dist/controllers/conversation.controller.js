"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = exports.getMessages = exports.createConversation = exports.getConversations = void 0;
const server_1 = require("../server");
const getConversations = async (req, res) => {
    try {
        const userId = req.user.id;
        const memberships = await server_1.prisma.membership.findMany({
            where: { userId },
            include: {
                conversation: {
                    include: {
                        memberships: {
                            include: { user: true }
                        },
                        messages: {
                            orderBy: { createdAt: 'desc' },
                            take: 1
                        }
                    }
                }
            },
            orderBy: { conversation: { updatedAt: 'desc' } }
        });
        const conversations = memberships.map(m => m.conversation);
        res.status(200).json({ conversations });
    }
    catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getConversations = getConversations;
const createConversation = async (req, res) => {
    // TODO: Implement conversation creation (1:1 and Group)
    res.status(201).json({ message: 'Create Conversation Endpoint' });
};
exports.createConversation = createConversation;
const getMessages = async (req, res) => {
    try {
        const conversationId = req.params.id;
        const cursor = req.query.cursor;
        const messages = await server_1.prisma.message.findMany({
            where: { conversationId },
            take: 50,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { createdAt: 'desc' },
            include: { sender: true }
        });
        res.status(200).json({ messages });
    }
    catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getMessages = getMessages;
const sendMessage = async (req, res) => {
    try {
        const conversationId = req.params.id;
        const { content } = req.body;
        const senderId = req.user.id;
        if (!content) {
            return res.status(400).json({ error: 'Message content is required' });
        }
        // Ensure user is part of the conversation
        const membership = await server_1.prisma.membership.findUnique({
            where: { userId_conversationId: { userId: senderId, conversationId } }
        });
        if (!membership) {
            return res.status(403).json({ error: 'You are not a member of this conversation' });
        }
        // Save message to DB
        const newMessage = await server_1.prisma.message.create({
            data: {
                content,
                senderId,
                conversationId,
            },
            include: { sender: true }
        });
        // Update conversation updatedAt
        await server_1.prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() }
        });
        // Broadcast via WebSockets
        server_1.io.to(conversationId).emit('receive_message', newMessage);
        res.status(201).json({ message: newMessage });
    }
    catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.sendMessage = sendMessage;
