"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.googleAuth = void 0;
const auth_service_1 = require("../services/auth.service");
const googleAuth = async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ error: 'idToken is required' });
        }
        const payload = await (0, auth_service_1.verifyGoogleToken)(idToken);
        if (!payload) {
            return res.status(401).json({ error: 'Invalid Google Token' });
        }
        const user = await (0, auth_service_1.loginOrRegisterUser)(payload);
        const token = (0, auth_service_1.generateToken)(user.id);
        res.status(200).json({
            user,
            token
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.googleAuth = googleAuth;
const getMe = async (req, res) => {
    // The user is attached by the auth middleware
    res.status(200).json({ user: req.user });
};
exports.getMe = getMe;
