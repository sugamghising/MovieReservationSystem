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
  onPayNow?: (reservationId: string) => void;
}

export default function ReservationCard({
  reservation,
  onCancel,
  onViewDetails,
  onPayNow,
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
      <CardHeader className="flex flex-col sm:flex-row items-start justify-between space-y-2 sm:space-y-0 pb-4">
        <div className="flex-1 w-full sm:w-auto">
          <div className="flex items-center gap-2 mb-2">
            <Ticket className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
            <span className="text-xs sm:text-sm text-muted-foreground truncate">
              Booking #{reservation.id.slice(0, 8)}...
            </span>
          </div>
          {reservation.showtime?.movie && (
            <h3 className="text-lg sm:text-xl font-bold line-clamp-2">
              {reservation.showtime.movie.title}
            </h3>
          )}
        </div>
        <div className="self-start">{getStatusBadge(reservation.status)}</div>
      </CardHeader>

      <CardContent className="space-y-3 sm:space-y-4">
        {reservation.showtime && (
          <>
            <div className="flex items-start gap-2 sm:gap-3">
              <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm break-words">
                {format(
                  new Date(reservation.showtime.startTime),
                  "EEEE, MMMM dd, yyyy"
                )}
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs sm:text-sm">
                {format(new Date(reservation.showtime.startTime), "h:mm a")}
              </span>
            </div>

            {reservation.showtime.theater && (
              <div className="flex items-start gap-2 sm:gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm break-words">
                  {reservation.showtime.theater.name}
                </span>
              </div>
            )}
          </>
        )}

        {reservation.reservationSeats &&
          reservation.reservationSeats.length > 0 && (
            <div className="pt-2 border-t">
              <p className="text-xs sm:text-sm font-medium mb-2">Seats</p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {reservation.reservationSeats.map((rs) => (
                  <span
                    key={rs.seat.id}
                    className="px-2 py-1 bg-primary/10 text-primary rounded text-xs sm:text-sm font-medium"
                  >
                    {rs.seat.label}
                  </span>
                ))}
              </div>
            </div>
          )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs sm:text-sm text-muted-foreground">
              Total Price
            </span>
          </div>
          <span className="text-lg sm:text-xl font-bold">
            ${reservation.totalPrice}
          </span>
        </div>
      </CardContent>

      {(canCancel || onViewDetails) && (
        <CardFooter className="flex flex-col sm:flex-row gap-2">
          {reservation.status === "HELD" && onPayNow && (
            <Button
              onClick={() => onPayNow(reservation.id)}
              className="w-full sm:flex-1 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-sm sm:text-base"
            >
              Pay Now - ${reservation.totalPrice}
            </Button>
          )}
          {onViewDetails && (
            <Button
              variant="outline"
              onClick={() => onViewDetails(reservation.id)}
              className="w-full sm:flex-1 text-sm sm:text-base"
            >
              View Details
            </Button>
          )}
          {canCancel && onCancel && (
            <Button
              variant="destructive"
              onClick={() => onCancel(reservation.id)}
              className="w-full sm:flex-1 text-sm sm:text-base"
            >
              Cancel Booking
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
