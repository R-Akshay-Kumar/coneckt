import { Request, Response } from 'express';
import { verifyGoogleToken, loginOrRegisterUser, generateToken } from '../services/auth.service';

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: 'idToken is required' });
    }

    const payload = await verifyGoogleToken(idToken);
    
    if (!payload) {
      return res.status(401).json({ error: 'Invalid Google Token' });
    }

    const user = await loginOrRegisterUser(payload);
    const token = generateToken(user.id);

    res.status(200).json({
      user,
      token
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  // The user is attached by the auth middleware
  res.status(200).json({ user: req.user });
};
