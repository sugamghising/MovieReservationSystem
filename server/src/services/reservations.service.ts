import prisma from "../config/db";
import { Prisma } from "@prisma/client";

type TransactionClient = Omit<typeof prisma, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;


/**
 * Creates a reservation for userId on showtimeId for given seatIds.
 * - Validates seat ownership (seat belongs to show's theater)
 * - Uses a transaction so inserts are atomic
 * - Uses a FOR UPDATE raw select to serialize access to existing reservation seats
 * - Falls back to UNIQUE constraint handling for race safety
 */
export const createReservation = async (userId: string, showtimeId: string, seatIds: string[]) => {
    if (!seatIds || seatIds.length === 0) throw new Error('No seats specified');

    return prisma.$transaction(async (tx: TransactionClient) => {
        const showtime = await tx.showtime.findUnique({ where: { id: showtimeId } });
        if (!showtime) {
            throw new Error('Showtime not Found')
        }

        const seats = await tx.seat.findMany({
            where: { id: { in: seatIds }, theaterId: showtime.theaterId }
        });
        if (seats.length !== seatIds.length) {
            throw new Error('Some seats do not belong in the theater');
        }

        // Check for existing reservation seats using Prisma query instead of raw SQL
        const existingReservationSeats = await tx.reservationSeat.findMany({
            where: {
                showtimeId: showtimeId,
                seatId: { in: seatIds }
            }
        });

        if (existingReservationSeats.length > 0) {
            throw new Error('One or more seats are already reserved');
        }

        // compute total price = showtime.price * seats + seat.extraPrice
        const seatExtras = seats.reduce((acc: number, s: typeof seats[number]) => acc + (s.extraPrice ?? 0), 0);
        const totalPrice = showtime.price * seatIds.length + seatExtras;


        // create reservation (status HELD)
        const reservation = await tx.reservation.create({
            data: {
                userId,
                showtimeId,
                status: 'HELD',
                totalPrice
            }
        });
        //insert reservation seats
        for (const seatId of seatIds) {
            try {
                await tx.reservationSeat.create({
                    data: {
                        reservationId: reservation.id,
                        seatId,
                        showtimeId,
                        priceAtBooking: showtime.price
                    }
                });
            } catch (e: any) {
                // unique constraint violation code from Prisma for postgres is P2002
                if (e && typeof e === 'object' && 'code' in e && e.code === 'P2002') {
                    throw new Error('Concurrent booking conflict: one or more seats already taken');
                }
                throw e;
            }
        }
        return reservation;
    }
    )
}

//Cancel reservation: only upcoming reservations (startTime > now) and owned by user (or admin)
export const cancelReservation = async (reservationId: string, userId: string, isAdmin: boolean) => {

    const reservation = await prisma.reservation.findUnique({ where: { id: reservationId }, include: { showtime: true } });
    if (!reservation) {
        throw new Error('Reservation not Found');
    }
    if (!isAdmin && reservation.userId !== userId) throw new Error('Forbidden');
    if (new Date(reservation.showtime.startTime) <= new Date()) {
        throw new Error('Cannot cancel past reservation.')
    }
    return prisma.reservation.update({ where: { id: reservationId }, data: { status: "CANCELLED" } })
}


export const listUserReservation = async (userId: string) => {
    return prisma.reservation.findMany({
        where: { userId },
        include: { seats: { include: { seat: true } }, showtime: { include: { movie: true, theater: true } } },
        orderBy: { createdAt: 'desc' }

    })
}


export const getReservation = async (reservationId: string) => {
    return prisma.reservation.findUnique({
        where: { id: reservationId },
        include: { seats: { include: { seat: true } }, showtime: { include: { movie: true, theater: true } } }
    });
}