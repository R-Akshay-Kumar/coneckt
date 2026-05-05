import api from './api';
import { AuthResponse } from '../types';

export const googleLogin = async (idToken: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/google', { idToken });
  return response.data;
};
