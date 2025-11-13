import {
  Loader2,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  CreditCard,
  User,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { Reservation } from "@/types/models";
import { format } from "date-fns";

interface ReservationDetailProps {
  reservation: Reservation;
  isLoading?: boolean;
  onCancel?: (reservationId: string) => void;
  onBack?: () => void;
}

export default function ReservationDetail({
  reservation,
  isLoading,
  onCancel,
  onBack,
}: ReservationDetailProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      HELD: "secondary",
      BOOKED: "default",
      CANCELLED: "destructive",
      EXPIRED: "outline",
    } as const;

    const colors = {
      HELD: "bg-yellow-100 text-yellow-800",
      BOOKED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      EXPIRED: "bg-gray-100 text-gray-800",
    } as const;

    return (
      <Badge
        variant={variants[status as keyof typeof variants] || "secondary"}
        className={colors[status as keyof typeof colors]}
      >
        {status}
      </Badge>
    );
  };

  const canCancel =
    reservation.status === "HELD" || reservation.status === "BOOKED";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold">Reservation Details</h1>
            <p className="text-muted-foreground">Booking #{reservation.id}</p>
          </div>
        </div>
        {getStatusBadge(reservation.status)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Movie Information */}
          {reservation.showtime?.movie && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ticket className="h-5 w-5" />
                  Movie Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  {reservation.showtime.movie.posterUrl && (
                    <img
                      src={reservation.showtime.movie.posterUrl}
                      alt={reservation.showtime.movie.title}
                      className="w-24 h-36 object-cover rounded-md"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-2">
                      {reservation.showtime.movie.title}
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      {reservation.showtime.movie.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <Badge variant="outline">
                        {reservation.showtime.movie.genre}
                      </Badge>
                      <span className="text-muted-foreground">
                        {reservation.showtime.movie.durationMin} min
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Showtime Details */}
          {reservation.showtime && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Showtime Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(reservation.showtime.startTime),
                        "EEEE, MMMM dd, yyyy"
                      )}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Time</p>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(reservation.showtime.startTime),
                        "h:mm a"
                      )}{" "}
                      -{" "}
                      {format(new Date(reservation.showtime.endTime), "h:mm a")}
                    </p>
                  </div>
                </div>

                {reservation.showtime.theater && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Theater</p>
                        <p className="text-sm text-muted-foreground">
                          {reservation.showtime.theater.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Capacity: {reservation.showtime.theater.capacity}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Seats Information */}
          {reservation.reservationSeats &&
            reservation.reservationSeats.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="h-5 w-5" />
                    Seat Selection
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {reservation.reservationSeats.map((rs) => (
                      <div
                        key={rs.seat.id}
                        className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium"
                      >
                        <p className="text-sm">Row {rs.seat.rowLabel}</p>
                        <p className="text-lg">{rs.seat.seatNumber}</p>
                        <p className="text-xs text-muted-foreground">
                          {rs.seat.seatType}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Payment Information */}
          {reservation.payment && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Payment Status
                  </span>
                  <Badge
                    variant={
                      reservation.payment.status === "COMPLETED"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {reservation.payment.status}
                  </Badge>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="font-semibold">
                    ${reservation.payment.amount}
                  </span>
                </div>

                {reservation.payment.stripePaymentIntentId && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Transaction ID
                      </span>
                      <span className="text-xs font-mono">
                        {reservation.payment.stripePaymentIntentId.slice(0, 20)}
                        ...
                      </span>
                    </div>
                  </>
                )}

                <Separator />

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Payment Date
                  </span>
                  <span className="text-sm">
                    {format(
                      new Date(reservation.payment.createdAt),
                      "MMM dd, yyyy 'at' h:mm a"
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Price Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Price Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {reservation.reservationSeats && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Seats ({reservation.reservationSeats.length})
                  </span>
                  <span className="font-medium">${reservation.totalPrice}</span>
                </div>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-bold">
                  ${reservation.totalPrice}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Booking Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Booking Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Booked On</p>
                <p className="font-medium">
                  {format(
                    new Date(reservation.createdAt),
                    "MMM dd, yyyy 'at' h:mm a"
                  )}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-muted-foreground mb-1">Booking ID</p>
                <p className="font-mono text-xs">{reservation.id}</p>
              </div>

              <Separator />

              <div>
                <p className="text-muted-foreground mb-1">User ID</p>
                <p className="font-mono text-xs">{reservation.userId}</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {canCancel && onCancel && (
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-5 w-5" />
                  Cancel Reservation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  If you cancel this reservation, your seats will be released
                  and a refund will be processed if payment was completed.
                </p>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => onCancel(reservation.id)}
                >
                  Cancel Reservation
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
