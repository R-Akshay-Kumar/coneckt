import { create } from 'zustand';
import type { Conversation, Message } from '../types';

interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: Message[];
  typingUsers: Record<string, string>; // conversationId -> userId (simplification for MVP)

  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (conversation: Conversation) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setTypingUser: (conversationId: string, userId: string | null) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  typingUsers: {},

  setConversations: (conversations) => set({ conversations }),
  
  setActiveConversation: (conversation) => set({ activeConversation: conversation }),
  
  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) => set((state) => {
    // Only add if it belongs to the active conversation
    if (state.activeConversation?.id === message.conversationId) {
      // Check for duplicates (React strict mode double-fires sometimes or socket + http race condition)
      const exists = state.messages.find(m => m.id === message.id);
      if (exists) return state;
      
      return { messages: [...state.messages, message] };
    }
    // TODO: Update conversation list "latest message" snippet and unread count
    return state;
  }),
  
  setTypingUser: (conversationId, userId) => set((state) => {
    const newTypingUsers = { ...state.typingUsers };
    if (userId) {
      newTypingUsers[conversationId] = userId;
    } else {
      delete newTypingUsers[conversationId];
    }
    return { typingUsers: newTypingUsers };
  }),
}));
