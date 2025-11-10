import prisma from '../config/db';


// Revenue Analytics
export const getRevenueReport = async (startDate?: Date, endDate?: Date) => {
    const where: any = {
        status: 'BOOKED',
        payment: { isNot: null }
    };

    if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
    }

    const reservations = await prisma.reservation.findMany({
        where,
        include: {
            payment: true,
            showtime: {
                include: {
                    movie: true,
                    theater: true
                }
            }
        }
    });

    const totalRevenue = reservations.reduce((sum: number, r: typeof reservations[number]) => sum + (r.payment?.amount || 0), 0);
    const totalBookings = reservations.length;
    const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

    // Revenue by movie
    const revenueByMovie = reservations.reduce((acc: any, r: typeof reservations[number]) => {
        const movieTitle = r.showtime.movie.title;
        if (!acc[movieTitle]) {
            acc[movieTitle] = { revenue: 0, bookings: 0 };
        }
        acc[movieTitle].revenue += r.payment?.amount || 0;
        acc[movieTitle].bookings += 1;
        return acc;
    }, {});

    // Revenue by theater
    const revenueByTheater = reservations.reduce((acc: any, r: typeof reservations[number]) => {
        const theaterName = r.showtime.theater.name;
        if (!acc[theaterName]) {
            acc[theaterName] = { revenue: 0, bookings: 0 };
        }
        acc[theaterName].revenue += r.payment?.amount || 0;
        acc[theaterName].bookings += 1;
        return acc;
    }, {});

    // Revenue by date
    const revenueByDate = reservations.reduce((acc: any, r: typeof reservations[number]) => {
        const date = r.createdAt.toISOString().split('T')[0] || '';
        if (!acc[date]) {
            acc[date] = { revenue: 0, bookings: 0 };
        }
        acc[date].revenue += r.payment?.amount || 0;
        acc[date].bookings += 1;
        return acc;
    }, {});

    return {
        summary: {
            totalRevenue,
            totalBookings,
            averageBookingValue,
            period: {
                startDate: startDate?.toISOString() || 'all time',
                endDate: endDate?.toISOString() || 'present'
            }
        },
        revenueByMovie: Object.entries(revenueByMovie).map(([movie, data]: any) => ({
            movie,
            revenue: data.revenue,
            bookings: data.bookings,
            averagePerBooking: data.revenue / data.bookings
        })),
        revenueByTheater: Object.entries(revenueByTheater).map(([theater, data]: any) => ({
            theater,
            revenue: data.revenue,
            bookings: data.bookings,
            averagePerBooking: data.revenue / data.bookings
        })),
        revenueByDate: Object.entries(revenueByDate).map(([date, data]: any) => ({
            date,
            revenue: data.revenue,
            bookings: data.bookings
        })).sort((a, b) => a.date.localeCompare(b.date))
    };
};

// Occupancy Analytics
export const getOccupancyReport = async (startDate?: Date, endDate?: Date) => {
    const where: any = {};

    if (startDate || endDate) {
        where.startTime = {};
        if (startDate) where.startTime.gte = startDate;
        if (endDate) where.startTime.lte = endDate;
    }

    const showtimes = await prisma.showtime.findMany({
        where,
        include: {
            theater: {
                include: {
                    seats: true
                }
            },
            movie: true,
            reservations: {
                where: {
                    status: { in: ['BOOKED', 'HELD'] }
                },
                include: {
                    seats: true
                }
            }
        }
    }) as any; // Type assertion to bypass Prisma type issue

    const occupancyData = showtimes.map((showtime: any) => {
        const totalSeats = showtime.theater.seats.length;
        const bookedSeats = showtime.reservations.reduce(
            (sum: number, r: any) => sum + r.seats.length,
            0
        );
        const occupancyRate = totalSeats > 0 ? (bookedSeats / totalSeats) * 100 : 0;

        return {
            showtimeId: showtime.id,
            movie: showtime.movie.title,
            theater: showtime.theater.name,
            startTime: showtime.startTime,
            totalSeats,
            bookedSeats,
            availableSeats: totalSeats - bookedSeats,
            occupancyRate: Math.round(occupancyRate * 100) / 100,
            status: occupancyRate >= 90 ? 'full' : occupancyRate >= 50 ? 'filling' : 'available'
        };
    });

    const averageOccupancy = occupancyData.length > 0
        ? occupancyData.reduce((sum: number, s: typeof occupancyData[number]) => sum + s.occupancyRate, 0) / occupancyData.length
        : 0;

    // Occupancy by movie
    const occupancyByMovie = occupancyData.reduce((acc: any, s: typeof occupancyData[number]) => {
        if (!acc[s.movie]) {
            acc[s.movie] = { totalShows: 0, totalSeats: 0, bookedSeats: 0 };
        }
        acc[s.movie].totalShows += 1;
        acc[s.movie].totalSeats += s.totalSeats;
        acc[s.movie].bookedSeats += s.bookedSeats;
        return acc;
    }, {});

    // Occupancy by theater
    const occupancyByTheater = occupancyData.reduce((acc: any, s: typeof occupancyData[number]) => {
        if (!acc[s.theater]) {
            acc[s.theater] = { totalShows: 0, totalSeats: 0, bookedSeats: 0 };
        }
        acc[s.theater].totalShows += 1;
        acc[s.theater].totalSeats += s.totalSeats;
        acc[s.theater].bookedSeats += s.bookedSeats;
        return acc;
    }, {});

    return {
        summary: {
            totalShowtimes: showtimes.length,
            averageOccupancy: Math.round(averageOccupancy * 100) / 100,
            period: {
                startDate: startDate?.toISOString() || 'all time',
                endDate: endDate?.toISOString() || 'present'
            }
        },
        showtimes: occupancyData,
        occupancyByMovie: Object.entries(occupancyByMovie).map(([movie, data]: any) => ({
            movie,
            totalShows: data.totalShows,
            occupancyRate: Math.round((data.bookedSeats / data.totalSeats) * 10000) / 100
        })),
        occupancyByTheater: Object.entries(occupancyByTheater).map(([theater, data]: any) => ({
            theater,
            totalShows: data.totalShows,
            occupancyRate: Math.round((data.bookedSeats / data.totalSeats) * 10000) / 100
        }))
    };
};

// Popular Movies Analytics
export const getPopularMoviesReport = async (limit: number = 10, startDate?: Date, endDate?: Date) => {
    const where: any = {
        status: 'BOOKED'
    };

    if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
    }

    const reservations = await prisma.reservation.findMany({
        where,
        include: {
            showtime: {
                include: {
                    movie: true
                }
            },
            seats: true,
            payment: true
        }
    });

    const movieStats = reservations.reduce((acc: any, r: typeof reservations[number]) => {
        const movieId = r.showtime.movieId;
        const movieTitle = r.showtime.movie.title;

        if (!acc[movieId]) {
            acc[movieId] = {
                movieId,
                title: movieTitle,
                totalBookings: 0,
                totalSeatsBooked: 0,
                totalRevenue: 0
            };
        }

        acc[movieId].totalBookings += 1;
        acc[movieId].totalSeatsBooked += r.seats.length;
        acc[movieId].totalRevenue += r.payment?.amount || 0;

        return acc;
    }, {});

    const popularMovies = Object.values(movieStats)
        .sort((a: any, b: any) => b.totalBookings - a.totalBookings)
        .slice(0, limit);

    return {
        summary: {
            totalUniqueMovies: Object.keys(movieStats).length,
            topMoviesCount: Math.min(limit, Object.keys(movieStats).length),
            period: {
                startDate: startDate?.toISOString() || 'all time',
                endDate: endDate?.toISOString() || 'present'
            }
        },
        popularMovies
    };
};

// Cancellation Analytics
export const getCancellationReport = async (startDate?: Date, endDate?: Date) => {
    const where: any = {};

    if (startDate || endDate) {
        where.createdAt = {};
        if (startDate) where.createdAt.gte = startDate;
        if (endDate) where.createdAt.lte = endDate;
    }

    const allReservations = await prisma.reservation.findMany({
        where,
        include: {
            showtime: {
                include: {
                    movie: true,
                    theater: true
                }
            },
            payment: true
        }
    });

    const totalReservations = allReservations.length;
    const cancelledReservations = allReservations.filter((r: typeof allReservations[number]) => r.status === 'CANCELLED');
    const cancellationRate = totalReservations > 0
        ? (cancelledReservations.length / totalReservations) * 100
        : 0;

    // Lost revenue from cancellations
    const lostRevenue = cancelledReservations.reduce((sum: number, r: typeof cancelledReservations[number]) =>
        sum + (r.payment?.amount || 0), 0
    );

    // Cancellations by movie
    const cancellationsByMovie = cancelledReservations.reduce((acc: any, r: typeof cancelledReservations[number]) => {
        const movieTitle = r.showtime.movie.title;
        if (!acc[movieTitle]) {
            acc[movieTitle] = { count: 0, lostRevenue: 0 };
        }
        acc[movieTitle].count += 1;
        acc[movieTitle].lostRevenue += r.payment?.amount || 0;
        return acc;
    }, {});

    // Cancellations by date
    const cancellationsByDate = cancelledReservations.reduce((acc: any, r: typeof cancelledReservations[number]) => {
        const date = r.createdAt.toISOString().split('T')[0] || '';
        if (!acc[date]) {
            acc[date] = 0;
        }
        acc[date] += 1;
        return acc;
    }, {});

    return {
        summary: {
            totalReservations,
            totalCancellations: cancelledReservations.length,
            cancellationRate: Math.round(cancellationRate * 100) / 100,
            lostRevenue,
            period: {
                startDate: startDate?.toISOString() || 'all time',
                endDate: endDate?.toISOString() || 'present'
            }
        },
        cancellationsByMovie: Object.entries(cancellationsByMovie).map(([movie, data]: any) => ({
            movie,
            cancellations: data.count,
            lostRevenue: data.lostRevenue
        })),
        cancellationsByDate: Object.entries(cancellationsByDate).map(([date, count]) => ({
            date,
            cancellations: count
        })).sort((a, b) => a.date.localeCompare(b.date))
    };
};

// Dashboard Overview
export const getDashboardOverview = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's stats
    const todayReservations = await prisma.reservation.count({
        where: {
            createdAt: { gte: today, lt: tomorrow },
            status: 'BOOKED'
        }
    });

    const todayRevenue = await prisma.payment.aggregate({
        where: {
            reservation: {
                createdAt: { gte: today, lt: tomorrow },
                status: 'BOOKED'
            }
        },
        _sum: { amount: true }
    });

    // Total stats
    const totalUsers = await prisma.user.count();
    const totalMovies = await prisma.movie.count();
    const totalTheaters = await prisma.theater.count();
    const totalReservations = await prisma.reservation.count({
        where: { status: 'BOOKED' }
    });

    // Upcoming showtimes
    const upcomingShowtimes = await prisma.showtime.count({
        where: {
            startTime: { gte: new Date() }
        }
    });

    // Recent reservations
    const recentReservations = await prisma.reservation.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { name: true, email: true } },
            showtime: {
                include: {
                    movie: { select: { title: true } },
                    theater: { select: { name: true } }
                }
            },
            seats: { include: { seat: { select: { label: true } } } }
        }
    });

    return {
        today: {
            reservations: todayReservations,
            revenue: todayRevenue._sum?.amount || 0
        },
        totals: {
            users: totalUsers,
            movies: totalMovies,
            theaters: totalTheaters,
            reservations: totalReservations,
            upcomingShowtimes
        },
        recentReservations: recentReservations.map((r: typeof recentReservations[number]) => ({
            id: r.id,
            user: r.user.name,
            movie: r.showtime.movie.title,
            theater: r.showtime.theater.name,
            seats: r.seats.map((s: typeof r.seats[number]) => s.seat.label).join(', '),
            status: r.status,
            createdAt: r.createdAt
        }))
    };
};