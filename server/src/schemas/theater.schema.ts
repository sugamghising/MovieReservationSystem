import { z } from 'zod';

export const createTheatreSchema = z.object({
    name: z.string().min(1, "name is required"),
    capacity: z.number().int().positive('Capacity must be positive.')
})

export const addSeatSchema = z.object({
    label: z.string(),
    row: z.string(),
    number: z.number().int(),
    type: z.string(),
    extraPrice: z.number().default(0)
})

export type CreateTheatreType = z.infer<typeof createTheatreSchema>
export type addSeatType = z.infer<typeof addSeatSchema>