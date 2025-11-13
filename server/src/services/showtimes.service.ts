import prisma from "../config/db";
import { createPaginatedResponse, getPaginationParams } from "../utils/pagination";

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

export const listShowtimes = async (filters?: { movieId?: string; date?: string; page?: number; limit?: number }) => {
    const { skip, take, page: currentPage, limit: itemsPerPage } = getPaginationParams(filters?.page, filters?.limit);

    const where: any = {};
    if (filters?.movieId) where.movieId = filters.movieId;
    if (filters?.date) {
        const dayStart = new Date(filters.date);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);
        where.startTime = { gte: dayStart, lt: dayEnd };
    }

    // Get total count and paginated data
    const [totalItems, showtimes] = await Promise.all([
        prisma.showtime.count({ where }),
        prisma.showtime.findMany({
            where,
            skip,
            take,
            include: {
                movie: true,
                theater: {
                    include: {
                        seats: true
                    }
                },
                reservationSeats: {
                    where: {
                        reservation: {
                            status: { in: ['BOOKED', 'HELD'] }
                        }
                    }
                }
            },
            orderBy: { startTime: 'asc' }
        })
    ]);

    // Calculate available seats for each showtime
    const showtimesWithSeats = showtimes.map((showtime: any) => {
        const reservedSeatIds = new Set(
            showtime.reservationSeats.map((rs: any) => rs.seatId)
        );

        const totalSeats = showtime.theater.seats.length;
        const availableSeats = totalSeats - reservedSeatIds.size;

        // Remove the full reservationSeats data and theater.seats from response
        const { reservationSeats, theater, ...showtimeData } = showtime;
        const { seats, ...theaterData } = theater;

        return {
            ...showtimeData,
            theater: theaterData,
            availableSeats,
            totalSeats
        };
    });

    return createPaginatedResponse(showtimesWithSeats, totalItems, currentPage, itemsPerPage);
}


export const getShowtimeByMovies = async (movieId: string) => {
    const showtimes = await prisma.showtime.findMany({
        where: { movieId: movieId },
        include: {
            movie: true,
            theater: {
                include: {
                    seats: true
                }
            },
            reservationSeats: {
                where: {
                    reservation: {
                        status: { in: ['BOOKED', 'HELD'] }
                    }
                }
            }
        },
        orderBy: { startTime: 'asc' }
    });

    // Calculate available seats for each showtime
    const showtimesWithSeats = showtimes.map((showtime: any) => {
        const reservedSeatIds = new Set(
            showtime.reservationSeats.map((rs: any) => rs.seatId)
        );

        const totalSeats = showtime.theater.seats.length;
        const availableSeats = totalSeats - reservedSeatIds.size;

        // Remove the full reservationSeats data and theater.seats from response
        const { reservationSeats, theater, ...showtimeData } = showtime;
        const { seats, ...theaterData } = theater;

        return {
            ...showtimeData,
            theater: theaterData,
            availableSeats,
            totalSeats
        };
    });

    return { showtimes: showtimesWithSeats };
}

export const updateShowtime = async (id: string, data:
    {
        movieId?: string,
        theaterId?: string,
        startTime?: Date | string,
        endTime?: Date | string,
        price?: number;
    }
) => {
    return prisma.showtime.update({ where: { id }, data })
}



//available seats for showtimes
export const availableSeats = async (id: string) => {
    const showtime = await prisma.showtime.findUnique({
        where: { id }, include: {
            theater: {
                include: {
                    seats: true
                }
            },
            reservations: {
                where: {
                    status: { in: ['BOOKED', 'HELD'] }
                },
                include: {
                    seats: {
                        include: {
                            seat: true
                        }
                    }
                }
            }
        }
    }) as any;

    if (!showtime) {
        throw new Error('Showtime not Found')
    }

    const reservedSeatIds = new Set(
        showtime.reservations.flatMap((reservation: any) =>
            reservation.seats.map((rs: any) => rs.seatId)
        )
    );

    const availableSeats = showtime.theater.seats.filter(
        (seat: any) => !reservedSeatIds.has(seat.id)
    );

    return {
        showtimeId: showtime.id,
        movieTitle: showtime.movieId,
        theaterName: showtime.theater.name,
        totalSeats: showtime.theater.seats.length,
        reservedSeats: reservedSeatIds.size,
        availableSeatsCount: availableSeats.length,
        seats: availableSeats.map((seat: any) => ({
            id: seat.id,
            label: seat.label,
            row: seat.row,
            number: seat.number,
            type: seat.type,
            extraPrice: seat.extraPrice
        }))
    };
}


//delete showtimes
export const deleteShowtime = async (id: string) => {
    return prisma.showtime.delete({ where: { id } })
}