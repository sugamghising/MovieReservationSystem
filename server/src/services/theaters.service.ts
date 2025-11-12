import prisma from '../config/db'
import { createPaginatedResponse, getPaginationParams } from '../utils/pagination';

export const createTheatre = async (name: string, capacity: number) => {

    const existingTheatre = await prisma.theater.findFirst({ where: { name: name } });
    if (existingTheatre) {
        throw new Error("Theatre Already Exists.");
    }
    const theatre = await prisma.theater.create({
        data: {
            name,
            capacity
        }
    })
    return theatre;

}

export const listTheatre = async (page?: number, limit?: number) => {
    const { skip, take, page: currentPage, limit: itemsPerPage } = getPaginationParams(page, limit);

    // Get total count and paginated data
    const [totalItems, theatres] = await Promise.all([
        prisma.theater.count(),
        prisma.theater.findMany({
            skip,
            take,
            include: { seats: true },
            orderBy: { name: 'asc' }
        })
    ]);

    if (!theatres) {
        throw new Error('Failed to get theatres.')
    }

    return createPaginatedResponse(theatres, totalItems, currentPage, itemsPerPage);
}

export const addSeat = async (theaterId: string, seatData: { label: string; row?: string | null; number?: number | null; type?: string | null; extraPrice?: number | null }) => {
    return prisma.seat.create({
        data: {
            theaterId,
            ...seatData
        }
    });
}

export const listSeat = async (theaterId: string, page?: number, limit?: number) => {
    const { skip, take, page: currentPage, limit: itemsPerPage } = getPaginationParams(page, limit);

    // Get total count and paginated data
    const [totalItems, seats] = await Promise.all([
        prisma.seat.count({ where: { theaterId } }),
        prisma.seat.findMany({
            where: { theaterId },
            skip,
            take,
            include: { theater: true },
            orderBy: [{ row: 'asc' }, { number: 'asc' }]
        })
    ]);

    return createPaginatedResponse(seats, totalItems, currentPage, itemsPerPage);
}