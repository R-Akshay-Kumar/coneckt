import { Request, Response } from 'express';
import { prisma, io } from '../server';

export const getConversations = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.id;
    const memberships = await prisma.membership.findMany({
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
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createConversation = async (req: Request, res: Response) => {
  try {
    const { targetUserId } = req.body;
    const currentUserId = req.user!.id;

    if (!targetUserId) {
      return res.status(400).json({ error: 'targetUserId is required' });
    }

    if (targetUserId === currentUserId) {
      return res.status(400).json({ error: 'Cannot create a conversation with yourself' });
    }

    // Check if a 1:1 conversation already exists between these two users
    // This is a bit tricky with Prisma, we look for a conversation that has EXACTLY these two members
    const existingConversations = await prisma.conversation.findMany({
      where: {
        type: 'DIRECT',
        AND: [
          { memberships: { some: { userId: currentUserId } } },
          { memberships: { some: { userId: targetUserId } } }
        ]
      },
      include: {
        memberships: {
          include: { user: true }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (existingConversations.length > 0) {
      return res.status(200).json({ conversation: existingConversations[0] });
    }

    // Create new 1:1 conversation
    const newConversation = await prisma.conversation.create({
      data: {
        type: 'DIRECT',
        memberships: {
          create: [
            { userId: currentUserId, role: 'MEMBER' },
            { userId: targetUserId, role: 'MEMBER' }
          ]
        }
      },
      include: {
        memberships: {
          include: { user: true }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    res.status(201).json({ conversation: newConversation });
  } catch (error) {
    console.error('Error creating conversation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const conversationId = req.params.id as string;
    const cursor = req.query.cursor as string | undefined;

    const messages = await prisma.message.findMany({
      where: { conversationId },
      take: 50,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { sender: true }
    });

    res.status(200).json({ messages });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  try {
    const conversationId = req.params.id as string;
    const { content } = req.body;
    const senderId = req.user!.id;

    if (!content) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    // Ensure user is part of the conversation
    const membership = await prisma.membership.findUnique({
      where: { userId_conversationId: { userId: senderId, conversationId } }
    });

    if (!membership) {
      return res.status(403).json({ error: 'You are not a member of this conversation' });
    }

    // Save message to DB
    const newMessage = await prisma.message.create({
      data: {
        content,
        senderId,
        conversationId,
      },
      include: { sender: true }
    });

    // Update conversation updatedAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() }
    });

    // Broadcast via WebSockets
    io.to(conversationId).emit('receive_message', newMessage);

    res.status(201).json({ message: newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
