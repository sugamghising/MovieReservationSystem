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

export const addSeat = async (theaterId: string, seatData: { label: string; row?: string | undefined; number?: number | undefined; type?: string | undefined; extraPrice?: number | undefined }) => {
    return prisma.seat.create({
        data: {
            theaterId,
            ...seatData
        }
    });
}