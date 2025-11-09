import { z } from 'zod';

export const createReservationSchema = z.object({
    showtimeId: z.string().uuid('Invalid showtime ID'),
    seatIds: z.array(z.string().uuid('Invalid seat ID')).min(1, 'At least one seat must be selected')
});

export type CreateReservationType = z.infer<typeof createReservationSchema>;
