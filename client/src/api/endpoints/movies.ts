import apiClient from "../client";
import { type Movie, type PaginatedResponse } from "../types";

export interface GetMoviesParams {
    page?: number;
    limit?: number;
    genre?: string;
    search?: string;
}

export interface CreateMovieRequest {
    title: string;
    description: string;
    genre: string;
    duration: number;
    releaseDate: string;
    posterUrl: string;
    rating?: number;
}

export type UpdateMovieRequest = Partial<CreateMovieRequest>;

export const moviesApi = {
    // Public endpoints
    getMovies: async (params: GetMoviesParams): Promise<PaginatedResponse<Movie>> => {
        const response = await apiClient.get('/movies', { params });
        return response.data;
    },

    getMovieById: async (id: string): Promise<{ movie: Movie }> => {
        const response = await apiClient.get(`/movies/${id}`);
        return response.data;
    },

    // Admin endpoints
    createMovie: async (data: CreateMovieRequest): Promise<{ movie: Movie }> => {
        const response = await apiClient.post('/movies', data);
        return response.data;
    },

    updateMovie: async (id: string, data: UpdateMovieRequest): Promise<{ movie: Movie }> => {
        const response = await apiClient.put(`/movies/${id}`, data);
        return response.data;
    },

    deleteMovie: async (id: string): Promise<{ message: string }> => {
        const response = await apiClient.delete(`/movies/${id}`);
        return response.data;
    },
};