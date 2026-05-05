import { Request, Response } from 'express';
import { prisma } from '../server';

export const searchUsers = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    const currentUserId = req.user!.id;

    if (!query || query.trim() === '') {
      return res.status(200).json({ users: [] });
    }

    const users = await prisma.user.findMany({
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
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
