"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.loginOrRegisterUser = exports.verifyGoogleToken = void 0;
const google_auth_library_1 = require("google-auth-library");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const server_1 = require("../server");
const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const verifyGoogleToken = async (idToken) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        return ticket.getPayload();
    }
    catch (error) {
        console.error('Error verifying Google Token:', error);
        return null;
    }
};
exports.verifyGoogleToken = verifyGoogleToken;
const loginOrRegisterUser = async (googlePayload) => {
    const { email, name, sub: googleId, picture: avatarUrl } = googlePayload;
    if (!email) {
        throw new Error('Google token did not contain an email address');
    }
    // Find or create user
    let user = await server_1.prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        user = await server_1.prisma.user.create({
            data: {
                email,
                name: name || 'User',
                googleId,
                avatarUrl,
                status: 'ONLINE',
            },
        });
    }
    else {
        // Update user info if needed
        user = await server_1.prisma.user.update({
            where: { id: user.id },
            data: {
                googleId: user.googleId || googleId,
                avatarUrl: user.avatarUrl || avatarUrl,
                status: 'ONLINE',
                lastSeen: new Date(),
            },
        });
    }
    return user;
};
exports.loginOrRegisterUser = loginOrRegisterUser;
const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod';
    return jsonwebtoken_1.default.sign({ userId }, secret, { expiresIn: '7d' });
};
exports.generateToken = generateToken;
