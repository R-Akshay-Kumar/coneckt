export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  status: 'ONLINE' | 'OFFLINE' | 'AWAY' | 'BUSY';
  lastSeen: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  conversationId: string;
  sender?: User;
}

export interface Membership {
  id: string;
  role: 'ADMIN' | 'MEMBER';
  user?: User;
}

export interface Conversation {
  id: string;
  isGroup: boolean;
  name: string | null;
  createdAt: string;
  updatedAt: string;
  memberships?: Membership[];
  messages?: Message[];
}
