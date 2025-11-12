import { moviesApi, type GetMoviesParams, type CreateMovieRequest, type UpdateMovieRequest } from '@/api/endpoints/movies';
import { QUERY_KEYS } from '@/lib/constants';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useMovies = (params: GetMoviesParams) => {
    return useQuery({
        queryKey: [QUERY_KEYS.MOVIES, params],
        queryFn: () => moviesApi.getMovies(params),
    });
};

export const useMovieDetail = (id: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.MOVIE_DETAIL, id],
        queryFn: () => moviesApi.getMovieById(id),
        enabled: !!id,
    });
};

// Create movie (Admin)
export const useCreateMovie = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateMovieRequest) => moviesApi.createMovie(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MOVIES] });
            toast.success('Movie created successfully');
        },
        onError: () => {
            toast.error('Failed to create movie');
        },
    });
};

// Update movie (Admin)
export const useUpdateMovie = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateMovieRequest }) =>
            moviesApi.updateMovie(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MOVIES] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MOVIE_DETAIL, variables.id] });
            toast.success('Movie updated successfully');
        },
        onError: () => {
            toast.error('Failed to update movie');
        },
    });
};

// Delete movie (Admin)
export const useDeleteMovie = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => moviesApi.deleteMovie(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MOVIES] });
            toast.success('Movie deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete movie');
        },
    });
};
