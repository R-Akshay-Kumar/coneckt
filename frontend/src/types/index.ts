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
