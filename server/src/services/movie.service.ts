import prisma from "../config/db";
import { createPaginatedResponse, getPaginationParams } from "../utils/pagination";

export const createMovie = async (data: { title: string, description?: string | null, posterUrl?: string | null, genre: string, durationMin: number }) => {
    return prisma.movie.create({ data });
}

export const listMovie = async (page?: number, limit?: number, genre?: string, search?: string) => {
    const { skip, take, page: currentPage, limit: itemsPerPage } = getPaginationParams(page, limit);

    // Build where clause
    const where: any = {};

    if (genre) {
        where.genre = genre;
    }

    if (search) {
        where.OR = [
            { title: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
        ];
    }

    // Get total count and paginated data
    const [totalItems, movies] = await Promise.all([
        prisma.movie.count({ where }),
        prisma.movie.findMany({
            where,
            skip,
            take,
            orderBy: { createdAt: 'desc' }
        })
    ]);

    return createPaginatedResponse(movies, totalItems, currentPage, itemsPerPage);
}

export const getMovie = async (id: string) => {
    return prisma.movie.findUnique({ where: { id } })
}

export const updateMovie = async (id: string, data: { title?: string, description?: string | null, posterUrl?: string | null, genre?: string, durationMin?: number }) => {
    return prisma.movie.update({ where: { id }, data })
}

export const deleteMovie = async (id: string) => {
    return prisma.movie.delete({ where: { id } })
}