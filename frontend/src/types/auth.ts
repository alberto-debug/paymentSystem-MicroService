export interface RegisterUserRequest {
  fullName: string;
  email: string;
  documentNumber: string;
  birthDate: string; // YYYY-MM-DD
  password: string;
}

export interface UserResponse {
  id: string;
  fullName: string;
  email: string;
  documentNumber: string;
  birthDate: string;
  keycloakId: string;
}

export interface UserMeResponse {
  email: string;
  fullName: string;
  keycloakId: string;
}

export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  errors?: Record<string, string>;
}
