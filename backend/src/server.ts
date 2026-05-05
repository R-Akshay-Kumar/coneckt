import { createServer } from 'http';
import app from './app';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { initializeSockets } from './sockets';

dotenv.config();

const PORT = process.env.PORT || 4000;
const httpServer = createServer(app);

// Initialize Socket.io
export const io = new Server(httpServer, {
  cors: {
    origin: '*', // TODO: configure for production
    methods: ['GET', 'POST']
  }
});

initializeSockets(io);

import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Initialize Prisma
export const prisma = new PrismaClient({ adapter });

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
