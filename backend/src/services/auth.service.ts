import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { prisma } from '../server';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (idToken: string) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    return ticket.getPayload();
  } catch (error) {
    console.error('Error verifying Google Token:', error);
    return null;
  }
};

export const loginOrRegisterUser = async (googlePayload: any) => {
  const { email, name, sub: googleId, picture: avatarUrl } = googlePayload;

  if (!email) {
    throw new Error('Google token did not contain an email address');
  }

  // Find or create user
  let user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        name: name || 'User',
        googleId,
        avatarUrl,
        status: 'ONLINE',
      },
    });
  } else {
    // Update user info if needed
    user = await prisma.user.update({
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

export const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_do_not_use_in_prod';
  return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};
