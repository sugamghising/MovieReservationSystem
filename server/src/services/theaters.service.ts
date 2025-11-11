import prisma from '../config/db'

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

export const listTheatre = async () => {
    const theatres = await prisma.theater.findMany({ include: { seats: true } })
    if (!theatres) {
        throw new Error('Failed to get theatres.')
    }
    return theatres;
}

export const addSeat = async (theaterId: string, seatData: { label: string; row?: string | null; number?: number | null; type?: string | null; extraPrice?: number | null }) => {
    return prisma.seat.create({
        data: {
            theaterId,
            ...seatData
        }
    });
}

export const listSeat = async (theaterId: string) => {
    return prisma.seat.findMany({
        where: { theaterId: theaterId },
        include: { theater: true }
    })
}