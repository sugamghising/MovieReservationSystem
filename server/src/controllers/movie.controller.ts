import { Request, Response } from 'express'
import * as movieService from '../services/movie.service';
import { createMovieSchema } from '../schemas/movie.schema';

export const createMovie = async (req: Request, res: Response) => {
    // Validate request body using Zod
    const parsed = createMovieSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.format() });
    }

    const { title, description, posterUrl, genre, durationMinute } = parsed.data;

    try {
        const movie = await movieService.createMovie({
            title,
            description,
            posterUrl,
            genre,
            // map incoming durationMinute to Prisma's durationMin
            durationMin: durationMinute,
        });
        res.status(201).json(movie);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
}

export const listMovie = async (req: Request, res: Response) => {
    try {
        const movies = await movieService.listMovie();
        res.json(movies);
    } catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
    }
}

export const getMovie = async (req: Request, res: Response) => {
    try {
        const { movieId } = req.params as { movieId: string };
        const movie = await movieService.getMovie(movieId);
        if (!movie) {
            return res.status(404).json({ message: "Movie not Found" });
        }
        res.json(movie);
    } catch (error) {
        console.error("Error fetching movie:", error);
        res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
    }
}

export const updateMovie = async (req: Request, res: Response) => {
    try {
        const { id } = req.params as { id: string };
        // Validate request body using Zod (reuse create schema)
        const parsed = createMovieSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ errors: parsed.error.format() });
        }

        const { title, description, posterUrl, genre, durationMinute } = parsed.data;

        const movie = await movieService.updateMovie(id, {
            title,
            description,
            posterUrl,
            genre,
            durationMin: durationMinute,
        });
        if (!movie) {
            return res.status(404).send({ message: "Movie not found" })
        }
        res.status(200).json(movie);

    } catch (error) {
        console.error("Error updating movie:", error);
        res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
    }
}

export const deleteMovie = async (req: Request, res: Response) => {
    try {
        const { movieId } = req.params as { movieId: string };
        const movie = await movieService.deleteMovie(movieId);
        res.status(200).json({ message: "Movie Deleted", movie })
    } catch (error) {
        console.error("Error deleting movie:", error);
        res.status(500).json({ message: "Internal Server Error", error: (error as Error).message });
    }
}