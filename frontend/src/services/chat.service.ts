import api from './api';
import { Conversation, Message } from '../types';

export const chatService = {
  getConversations: async (): Promise<Conversation[]> => {
    const response = await api.get<{conversations: Conversation[]}>('/conversations');
    return response.data.conversations;
  },

  getMessages: async (conversationId: string): Promise<Message[]> => {
    const response = await api.get<{messages: Message[]}>(`/conversations/${conversationId}/messages`);
    // Messages from backend are ordered by createdAt desc for pagination, 
    // but chat window needs chronological order (oldest first).
    return response.data.messages.reverse();
  },

  sendMessage: async (conversationId: string, content: string): Promise<Message> => {
    const response = await api.post<{message: Message}>(`/conversations/${conversationId}/messages`, { content });
    return response.data.message;
  }
};
