"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsers = void 0;
const server_1 = require("../server");
const searchUsers = async (req, res) => {
    try {
        const query = req.query.q;
        const currentUserId = req.user.id;
        if (!query || query.trim() === '') {
            return res.status(200).json({ users: [] });
        }
        const users = await server_1.prisma.user.findMany({
            where: {
                id: { not: currentUserId },
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } }
                ]
            },
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                status: true
            },
            take: 10
        });
        res.status(200).json({ users });
    }
    catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.searchUsers = searchUsers;
