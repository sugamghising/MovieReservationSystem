import { Request, Response } from 'express';
import * as reservationsService from '../services/reservations.service'
import { createReservationSchema } from '../schemas/reservation.schema';

export const createReservation = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;

        // Validate request body
        const parsed = createReservationSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ errors: parsed.error.format() });
        }

        const { showtimeId, seatIds } = parsed.data;
        const reservation = await reservationsService.createReservation(userId, showtimeId, seatIds);
        res.status(201).json(reservation);
    } catch (error) {
        console.error("Error creating reservations:", error);
        res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
    }
}

export const cancelReservation = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;
        const { id } = req.params as { id: string };
        const isAdmin = req.user!.role === 'ADMIN';
        await reservationsService.cancelReservation(id, userId, isAdmin);
        res.json({ success: true })
    } catch (error) {
        console.error("Error canceling reservation:", error);
        res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
    }
}

export const listUserReservation = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;
        const list = await reservationsService.listUserReservation(userId);
        res.json(list);
    } catch (error) {
        console.error("Error fetching user reservations:", error);
        res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
    }
}

export const getReservation = async (req: Request, res: Response) => {
    try {

        const { id } = req.params as { id: string };
        const reservation = await reservationsService.getReservation(id);
        res.json({ success: true, reservation })
    } catch (error) {
        console.error("Error getting reservation:", error);
        res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
    }
}