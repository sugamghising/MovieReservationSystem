import { z } from 'zod';

export const createMovieSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    posterUrl: z.string().url().optional(),
    genre: z.string().min(1, 'Genre is required'),
    // durationMinute is the incoming field name used by the API; we'll map to durationMin for Prisma
    durationMinute: z.number().int().positive('Duration must be a positive integer'),
});

export type CreateMovieInput = z.infer<typeof createMovieSchema>;
