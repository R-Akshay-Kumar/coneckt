import { Request, Response } from 'express';

export const googleAuth = async (req: Request, res: Response) => {
  // TODO: Implement Google OAuth logic
  res.status(200).json({ message: 'Google Auth Endpoint' });
};

export const getMe = async (req: Request, res: Response) => {
  // TODO: Return current authenticated user
  res.status(200).json({ message: 'Get Me Endpoint' });
};
