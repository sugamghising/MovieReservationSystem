import apiClient from "../client";
import { type User } from "../types";


export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export const authApi = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await apiClient.post('/auth/login', data);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<{ user: User }> => {
        const response = await apiClient.post('/auth/register', data);
        return response.data;
    },

    getCurrentUser: async (): Promise<{ user: User }> => {
        const response = await apiClient.get('/auth/me');
        return response.data;
    },
};