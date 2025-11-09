import prisma from "../config/db";

export const createShowtime = async (data:
    {
        movieId: string,
        theaterId: string,
        startTime: Date | string,
        endTime: Date | string,
        price: number;
    }
) => {
    const { movieId, theaterId, startTime, endTime, price } = data;
    // overlap check
    const overlapping = await prisma.showtime.findFirst({
        where: {
            theaterId,
            AND: [
                { startTime: { lt: new Date(endTime) } },
                { endTime: { gt: new Date(startTime) } }
            ]
        }
    });
    if (overlapping) {
        throw new Error('Showtime overlaps an existing show in the same theater');
    }
    const showtime = await prisma.showtime.create({
        data: { movieId, theaterId, startTime: new Date(startTime), endTime: new Date(endTime), price }
    });

    return showtime;
}

export const listShowtimes = async (filters?: { movieId?: string; date?: string }) => {
    const where: any = {};
    if (filters?.movieId) where.movieId = filters.movieId;
    if (filters?.date) {
        const dayStart = new Date(filters.date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);
        where.startTime = { gte: dayStart, lt: dayEnd };
    }
    return prisma.showtime.findMany({ where, include: { movie: true, theater: true } });

}