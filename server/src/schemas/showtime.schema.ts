import { z } from 'zod';

export const createShowtimeSchema = z.object({
    movieId: z.string().uuid('Invalid movie ID'),
    theaterId: z.string().uuid('Invalid theater ID'),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    price: z.number().positive('Price must be positive')
}).refine(data => data.endTime > data.startTime, {
    message: 'End time must be after start time',
    path: ['endTime']
});

export type createShowtimeType = z.infer<typeof createShowtimeSchema>;