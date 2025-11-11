import Stripe from "stripe";
import prisma from "../config/db";

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-10-29.clover",
});


export const createPaymentIntent = async (
    reservationId: string,
    userId: string
) => {
    // 1. Fetch reservation details
    const reservation = await prisma.reservation.findUnique({
        where: { id: reservationId },
        include: {
            showtime: {
                include: {
                    movie: true,
                    theater: true,
                },
            },
            seats: {
                include: {
                    seat: true,
                },
            },
        },
    });
    // 2. Validation checks
    if (!reservation) {
        throw new Error("Reservation not found");
    }

    if (reservation.userId !== userId) {
        throw new Error("Unauthorized: This reservation does not belong to you");
    }

    if (reservation.status !== "HELD") {
        throw new Error(
            `Cannot process payment. Reservation status: ${reservation.status}`
        );
    }

    // 3. Check for existing payment
    const existingPayment = await prisma.payment.findUnique({
        where: { reservationId },
    });

    if (existingPayment && existingPayment.status === "succeeded") {
        throw new Error("Payment already completed for this reservation");
    }

    // 4. Calculate amount (convert to cents for Stripe)
    const amountInCents = Math.round((reservation.totalPrice || 0) * 100);

    // 5. Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create(
        {
            amount: amountInCents,
            currency: process.env.STRIPE_CURRENCY || "usd",
            metadata: {
                reservationId: reservation.id,
                userId: userId,
                movieTitle: reservation.showtime.movie.title,
                theaterName: reservation.showtime.theater.name,
                seatCount: reservation.seats.length,
            },
            description: `Movie: ${reservation.showtime.movie.title} at ${reservation.showtime.theater.name}`,
        },
        {
            idempotencyKey: `reservation_${reservationId}`, // Prevent duplicate charges
        }
    );

    // 6. Store/Update payment record in database
    const payment = existingPayment
        ? await prisma.payment.update({
            where: { id: existingPayment.id },
            data: {
                providerTxnId: paymentIntent.id,
                status: "pending",
            },
        })
        : await prisma.payment.create({
            data: {
                reservationId: reservation.id,
                amount: reservation.totalPrice || 0,
                providerTxnId: paymentIntent.id,
                status: "pending",
            },
        });

    // 7. Return payment details
    return {
        paymentId: payment.id,
        clientSecret: paymentIntent.client_secret, // Frontend needs this
        amount: reservation.totalPrice,
        currency: process.env.STRIPE_CURRENCY || "usd",
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        reservation: {
            id: reservation.id,
            movieTitle: reservation.showtime.movie.title,
            theaterName: reservation.showtime.theater.name,
            showtime: reservation.showtime.startTime,
            seats: reservation.seats.map((rs) => rs.seat.label),
        },
    };
};


export const confirmPayment = async (paymentId: string, userId: string) => {
    // 1. Get payment from database
    const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
            reservation: true,
        },
    });

    if (!payment) {
        throw new Error("Payment not found");
    }

    if (payment.reservation.userId !== userId) {
        throw new Error("Unauthorized");
    }

    // 2. Check payment status with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(
        payment.providerTxnId!
    );

    if (paymentIntent.status === "succeeded") {
        // 3. Update database
        await prisma.$transaction([
            prisma.payment.update({
                where: { id: paymentId },
                data: { status: "succeeded" },
            }),
            prisma.reservation.update({
                where: { id: payment.reservationId },
                data: { status: "BOOKED" },
            }),
        ]);

        return {
            success: true,
            message: "Payment confirmed successfully",
            payment,
            paymentIntent: {
                id: paymentIntent.id,
                status: paymentIntent.status,
                amount: paymentIntent.amount / 100,
            },
        };
    }

    return {
        success: false,
        message: `Payment status: ${paymentIntent.status}`,
        status: paymentIntent.status,
    };
};


export const handleStripeWebhook = async (
    payload: Buffer,
    signature: string
) => {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
        // Verify webhook signature (IMPORTANT for security!)
        event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err: any) {
        console.error("⚠️ Webhook signature verification failed:", err.message);
        throw new Error(`Webhook Error: ${err.message}`);
    }

    console.log("📨 Webhook received:", event.type);

    // Handle different event types
    switch (event.type) {
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log("✅ Payment succeeded:", paymentIntent.id);

            // Find payment in database
            const payment = await prisma.payment.findFirst({
                where: { providerTxnId: paymentIntent.id },
            });

            if (payment) {
                // Update payment and reservation status
                await prisma.$transaction([
                    prisma.payment.update({
                        where: { id: payment.id },
                        data: { status: "succeeded" },
                    }),
                    prisma.reservation.update({
                        where: { id: payment.reservationId },
                        data: { status: "BOOKED" },
                    }),
                ]);

                console.log(`✅ Reservation ${payment.reservationId} marked as BOOKED`);
            }
            break;
        }

        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log("❌ Payment failed:", paymentIntent.id);

            const payment = await prisma.payment.findFirst({
                where: { providerTxnId: paymentIntent.id },
            });

            if (payment) {
                await prisma.payment.update({
                    where: { id: payment.id },
                    data: { status: "failed" },
                });

                console.log(`❌ Payment ${payment.id} marked as failed`);
            }
            break;
        }

        case "payment_intent.canceled": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log("🚫 Payment canceled:", paymentIntent.id);

            const payment = await prisma.payment.findFirst({
                where: { providerTxnId: paymentIntent.id },
            });

            if (payment) {
                await prisma.payment.update({
                    where: { id: payment.id },
                    data: { status: "failed" },
                });
            }
            break;
        }

        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    return { received: true };
};


export const getPaymentById = async (paymentId: string, userId: string) => {
    const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
            reservation: {
                include: {
                    showtime: {
                        include: {
                            movie: true,
                            theater: true,
                        },
                    },
                    seats: {
                        include: {
                            seat: true,
                        },
                    },
                },
            },
        },
    });

    if (!payment) {
        throw new Error("Payment not found");
    }

    if (payment.reservation.userId !== userId) {
        throw new Error("Unauthorized");
    }

    return payment;
};

/**
 * Get Payment by Reservation ID
 */
export const getPaymentByReservationId = async (
    reservationId: string,
    userId: string
) => {
    const payment = await prisma.payment.findUnique({
        where: { reservationId },
        include: {
            reservation: {
                include: {
                    showtime: {
                        include: {
                            movie: true,
                            theater: true,
                        },
                    },
                },
            },
        },
    });

    if (!payment) {
        throw new Error("Payment not found for this reservation");
    }

    if (payment.reservation.userId !== userId) {
        throw new Error("Unauthorized");
    }

    return payment;
};

/**
 * Refund Payment
 * Used when user cancels reservation
 */
export const refundPayment = async (
    paymentId: string,
    userId: string,
    reason?: string
) => {
    const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { reservation: true },
    });

    if (!payment) {
        throw new Error("Payment not found");
    }

    if (payment.reservation.userId !== userId) {
        throw new Error("Unauthorized");
    }

    if (payment.status !== "succeeded") {
        throw new Error("Cannot refund: Payment not succeeded");
    }

    // Create refund with Stripe
    const refund = await stripe.refunds.create({
        payment_intent: payment.providerTxnId!,
        reason: "requested_by_customer",
    });

    // Update database
    await prisma.$transaction([
        prisma.payment.update({
            where: { id: paymentId },
            data: { status: "refunded" },
        }),
        prisma.reservation.update({
            where: { id: payment.reservationId },
            data: { status: "CANCELLED" },
        }),
    ]);

    return {
        success: true,
        refund,
        message: "Payment refunded successfully",
    };
};