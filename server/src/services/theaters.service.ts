import prisma from '../config/db'

export const createTheatre = async (name: string, capacity: number) => {

    const existingTheatre = await prisma.theatre.findUnique({ where: { name: name } });
    if (existingTheatre) {
        throw new Error("Theatre Already Exists.");
    }
    const theatre = await prisma.theatre.create({
        name,
        capacity
    })
    return theatre;

}

export const listTheatre = async () => {
    const theatres = await prisma.theatre.findMany({ include: { seats: true } })
    if (!theatres) {
        throw new Error('Failed to get theatres.')
    }
    return theatres;
}

export const addSeat = async (theatreId: string, seatData: { label: string; row?: string; number?: number; type?: string; extraPrice?: number }) => {
    return prisma.seat.create({ theatreId, ...seatData });
}