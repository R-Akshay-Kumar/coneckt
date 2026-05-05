import { Request, Response } from 'express';

export const searchUsers = async (req: Request, res: Response) => {
  // TODO: Implement user search
  res.status(200).json({ message: 'Search Users Endpoint' });
};
