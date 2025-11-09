import { Response, Request } from "express";
import * as showtimeService from "../services/showtimes.service"
import { createShowtimeSchema } from "../schemas/showtime.schema";

export const createShowtime = async (req: Request, res: Response) => {

    const parsed = createShowtimeSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.format() });
    }
    const { movieId, theaterId, startTime, endTime, price } = parsed.data;
    try {
        const showtime = await showtimeService.createShowtime({
            movieId,
            theaterId,
            startTime,
            endTime,
            price,
        });

        if (!showtime) {
            return res.status(400).json({ message: "Failed to create showtime." });
        }

        return res.status(201).json(showtime);

    } catch (error) {
        console.error("Error creating showtime:", error);
        res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
    }
}

export const listShowtimes = async (req: Request, res: Response) => {
    const { movieId, date } = req.query as { movieId?: string; date?: string };

    try {
        // Build filters object only with defined values
        const filters: { movieId?: string; date?: string } = {};
        if (movieId) filters.movieId = movieId;
        if (date) filters.date = date;

        const showtimes = await showtimeService.listShowtimes(filters);
        if (!showtimes || showtimes.length === 0) {
            return res.status(404).json({ message: "No showtimes found." })
        }
        return res.json(showtimes);
    } catch (error) {
        console.error("Error fetching showtimes:", error);
        res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
    }
}