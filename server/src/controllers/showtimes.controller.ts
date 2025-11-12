import { Response, Request } from "express";
import * as showtimeService from "../services/showtimes.service"
import { createShowtimeSchema } from "../schemas/showtime.schema";


//create showtime
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
//list all showtimes
export const listShowtimes = async (req: Request, res: Response) => {
    const { movieId, date, page, limit } = req.query as { movieId?: string; date?: string; page?: string; limit?: string };

    try {
        // Build filters object with pagination
        const filters: { movieId?: string; date?: string; page?: number; limit?: number } = {};
        if (movieId) filters.movieId = movieId;
        if (date) filters.date = date;
        if (page) filters.page = parseInt(page);
        if (limit) filters.limit = parseInt(limit);

        const result = await showtimeService.listShowtimes(filters);
        return res.json(result);
    } catch (error) {
        console.error("Error fetching showtimes:", error);
        res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
    }
}

//get showtimes by movies
export const getShowtimeByMovies = async (req: Request, res: Response) => {
    try {
        const { movieId } = req.params as { movieId: string };
        const showtime = showtimeService.getShowtimeByMovies(movieId);

        return res.status(200).json(showtime)
    } catch (error) {
        console.error("Error fetching showtimes by movies:", error);
        res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
    }
}

//Get Available Seats for Showtime
export const getAvailableSeats = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const availableSeats = await showtimeService.availableSeats(id);

        res.status(201).json(availableSeats);
    } catch (error) {
        console.error("Error fetching available Seats:", error);
        res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
    }
}


//Update Showtime
export const updateShowtime = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const parsed = createShowtimeSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ errors: parsed.error.format() });
        }
        const { movieId, theaterId, startTime, endTime, price } = parsed.data;
        const showtime = await showtimeService.updateShowtime(id, {
            movieId, theaterId, startTime, endTime, price
        })
        if (!showtime) {
            return res.status(404).send({ message: "showtime not found" })
        }
        return res.status(201).json({ message: "showtime updated successfully", showtime })
    } catch (error) {
        console.error("Error updating showtimes:", error);
        res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
    }
}

//deleteshowtime

export const deleteShowtime = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        const movie = showtimeService.deleteShowtime(id);

        return res.status(201).json({ message: "Showtime deleted successfully.", movie })

    } catch (error) {
        console.error("Error deleting showtime:", error);
        res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
    }
}