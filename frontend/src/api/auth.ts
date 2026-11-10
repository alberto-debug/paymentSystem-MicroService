import { apiClient, API_BASE_URL } from './client';
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
    window.location.href = `${API_BASE_URL}/logout`;
  },

  redirectToLogin: (): void => {
    window.location.href = `${API_BASE_URL}/oauth2/authorization/keycloak`;
  },
};
