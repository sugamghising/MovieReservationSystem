import { Request, Response } from 'express';
import * as theatreService from '../services/theaters.service'
import { createTheatreSchema, addSeatSchema } from '../schemas/theater.schema';

export const createTheatre = async (req: Request, res: Response) => {
    const parsed = createTheatreSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.format() });
    }
    const { name, capacity } = parsed.data;

    try {
        const theater = await theatreService.createTheatre(name, capacity);
        if (!theater) {
            return res.status(401).json("Cannot create Theatre.");
        }
        return res.status(201).json({ message: "Theatre Created successfully.", theater: theater })
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
}


export const listTheatre = async (req: Request, res: Response) => {
    try {
        const page = req.query.page ? parseInt(req.query.page as string) : undefined;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

        const result = await theatreService.listTheatre(page, limit);
        return res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
}

export const addSeat = async (req: Request, res: Response) => {
    const parsed = addSeatSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.format() });
    }

    const { theatreId } = req.params as { theatreId: string };
    const seatData = {
        ...parsed.data,
        row: parsed.data.row ?? null,
        number: parsed.data.number ?? null,
        type: parsed.data.type ?? null,
        extraPrice: parsed.data.extraPrice ?? null
    };

    try {
        const seat = await theatreService.addSeat(theatreId, seatData);
        if (!seat) {
            return res.status(400).send({ message: "seat not added" })
        }
        res.status(200).json(seat);
    } catch (error) {
        console.error("Error adding seat:", error);
        res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
    }
}


export const listSeat = async (req: Request, res: Response) => {
    try {
        const { theaterId } = req.params as { theaterId: string };
        const page = req.query.page ? parseInt(req.query.page as string) : undefined;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

        const result = await theatreService.listSeat(theaterId, page, limit);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error listing seats:", error);
        res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
    }
}