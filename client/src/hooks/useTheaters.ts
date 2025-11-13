import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { theatersApi, type GetTheatersParams, type CreateTheaterRequest, type AddSeatRequest } from '@/api/endpoints/theaters';
import { QUERY_KEYS } from '@/lib/constants';
import { toast } from 'react-hot-toast';

// Get theaters
export const useTheaters = (params: GetTheatersParams) => {
    return useQuery({
        queryKey: [QUERY_KEYS.THEATERS, params],
        queryFn: () => theatersApi.getTheaters(params),
    });
};

// Get theater seats (Admin)
export const useTheaterSeats = (theaterId: string, params?: { page?: number; limit?: number }) => {
    return useQuery({
        queryKey: [QUERY_KEYS.SEATS, theaterId, params],
        queryFn: () => theatersApi.getTheaterSeats(theaterId, params),
        enabled: !!theaterId,
    });
};

// Create theater (Admin)
export const useCreateTheater = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateTheaterRequest) => theatersApi.createTheater(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.THEATERS] });
            toast.success('Theater created successfully');
        },
        onError: () => {
            toast.error('Failed to create theater');
        },
    });
};

// Add seat to theater (Admin)
export const useAddSeat = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ theaterId, data }: { theaterId: string; data: AddSeatRequest }) =>
            theatersApi.addSeat(theaterId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SEATS, variables.theaterId] });
            toast.success('Seat added successfully');
        },
        onError: () => {
            toast.error('Failed to add seat');
        },
    });
};
