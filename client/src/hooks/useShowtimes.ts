import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { showtimesApi, type GetShowtimesParams, type CreateShowtimeRequest, type UpdateShowtimeRequest } from '@/api/endpoints/showtimes';
import { QUERY_KEYS } from '@/lib/constants';
import { toast } from 'react-hot-toast';

// Get showtimes
export const useShowtimes = (params: GetShowtimesParams) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SHOWTIMES, params],
        queryFn: () => showtimesApi.getShowtimes(params),
    });
};

// Get showtimes by movie
export const useShowtimesByMovie = (movieId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SHOWTIMES, 'movie', movieId],
        queryFn: () => showtimesApi.getShowtimesByMovie(movieId),
        enabled: !!movieId,
    });
};

// Get available seats
export const useAvailableSeats = (showtimeId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.AVAILABLE_SEATS, showtimeId],
        queryFn: () => showtimesApi.getAvailableSeats(showtimeId),
        enabled: !!showtimeId,
    });
};

// Create showtime (Admin)
export const useCreateShowtime = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateShowtimeRequest) => showtimesApi.createShowtime(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SHOWTIMES] });
            toast.success('Showtime created successfully');
        },
        onError: () => {
            toast.error('Failed to create showtime');
        },
    });
};

// Update showtime (Admin)
export const useUpdateShowtime = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateShowtimeRequest }) =>
            showtimesApi.updateShowtime(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SHOWTIMES] });
            toast.success('Showtime updated successfully');
        },
        onError: () => {
            toast.error('Failed to update showtime');
        },
    });
};

// Delete showtime (Admin)
export const useDeleteShowtime = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => showtimesApi.deleteShowtime(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SHOWTIMES] });
            toast.success('Showtime deleted successfully');
        },
        onError: () => {
            toast.error('Failed to delete showtime');
        },
    });
};
