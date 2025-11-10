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
        const theaters = await theatreService.listTheatre();
        if (!theaters) {
            return res.status(404).json({ message: "Cannot find theatre." })
        }
        return res.status(200).json(theaters)
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