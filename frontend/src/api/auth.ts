import { apiClient } from './client';
import type { RegisterUserRequest, UserResponse, UserMeResponse } from '../types/auth';

export const authService = {
  register: (payload: RegisterUserRequest): Promise<UserResponse> => {
    return apiClient<UserResponse>('/api/public/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getMe: (): Promise<UserMeResponse> => {
    return apiClient<UserMeResponse>('/api/users/me', {
      method: 'GET',
    });
  },

  logout: async (): Promise<void> => {
    window.location.href = 'http://localhost:8080/logout';
  },

  redirectToLogin: (): void => {
    window.location.href = 'http://localhost:8080/api/public/auth/login';
  },
};
