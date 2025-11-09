import { z } from 'zod';

export const createShowtimeSchema = z.object({
    movieId: z.string(),
    theaterId: z.string(),
    startTime: z.date(),
    endTime: z.date(),
    price: z.number()
})

export type createShowtimeType = z.infer<typeof createShowtimeSchema>;