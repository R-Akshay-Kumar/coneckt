import api from './api';
import type { User } from '../types';

export const userService = {
  searchUsers: async (query: string): Promise<User[]> => {
    const response = await api.get<{users: User[]}>(`/users?q=${encodeURIComponent(query)}`);
    return response.data.users;
  }
};
