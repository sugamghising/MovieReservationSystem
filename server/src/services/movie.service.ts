import prisma from "../config/db";

export const createMovie = async (data: { title: string, description?: string | undefined, posterUrl?: string | undefined, genre: string, durationMin: number }) => {
    return prisma.movie.create({ data });
}

export const listMovie = async () => {
    return prisma.movie.findMany({ orderBy: { createdAt: 'desc' } });
}

export const getMovie = async (id: string) => {
    return prisma.movie.findUnique({ where: { id } })
}

export const updateMovie = async (id: string, data: { title?: string | undefined, description?: string | undefined, posterUrl?: string | undefined, genre?: string | undefined, durationMin?: number | undefined }) => {
    return prisma.movie.update({ where: { id }, data })
}

export const deleteMovie = async (id: string) => {
    return prisma.movie.delete({ where: { id } })
}