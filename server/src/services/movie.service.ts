import prisma from "../config/db";

export const createMovie = async (data: { title: string, description?: string | null, posterUrl?: string | null, genre: string, durationMin: number }) => {
    return prisma.movie.create({ data });
}

export const listMovie = async () => {
    return prisma.movie.findMany({ orderBy: { createdAt: 'desc' } });
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