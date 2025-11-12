import { Calendar, Clock, MapPin, Ticket, CreditCard } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Reservation } from "@/types/models";
import { format } from "date-fns";

interface ReservationCardProps {
  reservation: Reservation;
  onCancel?: (reservationId: string) => void;
  onViewDetails?: (reservationId: string) => void;
}

export default function ReservationCard({
  reservation,
  onCancel,
  onViewDetails,
}: ReservationCardProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      HELD: "secondary",
      BOOKED: "default",
      CANCELLED: "destructive",
      EXPIRED: "outline",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status}
      </Badge>
    );
  };

  const canCancel =
    reservation.status === "HELD" || reservation.status === "BOOKED";

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Ticket className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Booking #{reservation.id}
            </span>
          </div>
          {reservation.showtime?.movie && (
            <h3 className="text-xl font-bold">
              {reservation.showtime.movie.title}
            </h3>
          )}
        </div>
        {getStatusBadge(reservation.status)}
      </CardHeader>

      <CardContent className="space-y-4">
        {reservation.showtime && (
          <>
            <div className="flex items-center gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {format(
                  new Date(reservation.showtime.startTime),
                  "EEEE, MMMM dd, yyyy"
                )}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {format(new Date(reservation.showtime.startTime), "h:mm a")}
              </span>
            </div>

            {reservation.showtime.theater && (
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {reservation.showtime.theater.name}
                </span>
              </div>
            )}
          </>
        )}

        {reservation.reservationSeats &&
          reservation.reservationSeats.length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-sm font-medium mb-2">Seats</p>
              <div className="flex flex-wrap gap-2">
                {reservation.reservationSeats.map((rs) => (
                  <span
                    key={rs.seat.id}
                    className="px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                  >
                    {rs.seat.seatNumber}
                  </span>
                ))}
              </div>
            </div>
          )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Total Price</span>
          </div>
          <span className="text-xl font-bold">${reservation.totalPrice}</span>
        </div>
      </CardContent>

      {(canCancel || onViewDetails) && (
        <CardFooter className="flex gap-2">
          {onViewDetails && (
            <Button
              variant="outline"
              onClick={() => onViewDetails(reservation.id)}
              className="flex-1"
            >
              View Details
            </Button>
          )}
          {canCancel && onCancel && (
            <Button
              variant="destructive"
              onClick={() => onCancel(reservation.id)}
              className="flex-1"
            >
              Cancel Booking
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
