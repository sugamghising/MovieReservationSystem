import { z } from 'zod';

export const createTheatreSchema = z.object({
    name: z.string().min(1, "name is required"),
    capacity: z.number().int().positive('Capacity must be positive.')
})

export const addSeatSchema = z.object({
    label: z.string().min(1, 'Label is required'),
    row: z.string().optional(),
    number: z.number().int().optional(),
    type: z.string().optional(),
    extraPrice: z.number().nonnegative('Extra price cannot be negative').default(0)
})

export type CreateTheatreType = z.infer<typeof createTheatreSchema>
export type addSeatType = z.infer<typeof addSeatSchema>