import { apiClient } from "../lib/api/client";

export interface RegisterPayload {
  name: string;
  businessName: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  businessId: string | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: AuthUser;
  [key: string]: unknown;
}

export interface GetMeResponse {
  success: boolean;
  message: string;
  data: AuthUser;
}

export const authService = {
  register(payload: RegisterPayload) {
    return apiClient<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  login(payload: LoginPayload) {
    return apiClient<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  test() {
    return apiClient<AuthResponse>("/auth/test", {
      method: "GET",
    });
  },
  getMe() {
    return apiClient<GetMeResponse>("/auth/me", {
      method: "GET",
    });
  },
};
