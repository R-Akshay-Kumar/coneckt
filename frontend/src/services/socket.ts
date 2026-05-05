import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/useAuthStore';
import { useChatStore } from '../store/useChatStore';

const SOCKET_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
  : 'http://localhost:4000';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    const token = useAuthStore.getState().token;
    
    if (!token) return;
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      auth: { token }
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    this.socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    // --- Listeners that update Zustand directly ---

    this.socket.on('receive_message', (message) => {
      useChatStore.getState().addMessage(message);
    });

    this.socket.on('user_typing', ({ conversationId, userId }) => {
      useChatStore.getState().setTypingUser(conversationId, userId);
    });

    this.socket.on('user_stopped_typing', ({ conversationId }) => {
      useChatStore.getState().setTypingUser(conversationId, null);
    });

    this.socket.on('presence_update', ({ userId, status }) => {
      // For future MVP enhancement: update specific user status in conversation list
      console.log(`User ${userId} is now ${status}`);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRooms(conversationIds: string[]) {
    if (this.socket?.connected) {
      this.socket.emit('join_rooms', conversationIds);
    }
  }

  emitTypingStart(conversationId: string) {
    if (this.socket?.connected) {
      this.socket.emit('typing_start', { conversationId });
    }
  }

  emitTypingStop(conversationId: string) {
    if (this.socket?.connected) {
      this.socket.emit('typing_stop', { conversationId });
    }
  }
}

export const socketService = new SocketService();
