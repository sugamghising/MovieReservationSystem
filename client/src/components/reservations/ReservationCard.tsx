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
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row items-start justify-between space-y-2 sm:space-y-0 pb-3 sm:pb-4 p-4 sm:p-6">
        <div className="flex-1 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
            <Ticket className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
            <span className="text-xs sm:text-sm text-muted-foreground truncate">
              Booking #{reservation.id.slice(0, 8)}...
            </span>
          </div>
          {reservation.showtime?.movie && (
            <h3 className="text-base sm:text-lg md:text-xl font-bold line-clamp-2 leading-tight">
              {reservation.showtime.movie.title}
            </h3>
          )}
        </div>
        <div className="self-start">{getStatusBadge(reservation.status)}</div>
      </CardHeader>

      <CardContent className="space-y-2.5 sm:space-y-3 md:space-y-4 p-4 sm:p-6 pt-0">
        {reservation.showtime && (
          <>
            <div className="flex items-start gap-1.5 sm:gap-2 md:gap-3">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm break-words leading-tight">
                {format(
                  new Date(reservation.showtime.startTime),
                  "EEEE, MMMM dd, yyyy"
                )}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-xs sm:text-sm">
                {format(new Date(reservation.showtime.startTime), "h:mm a")}
              </span>
            </div>

            {reservation.showtime.theater && (
              <div className="flex items-start gap-1.5 sm:gap-2 md:gap-3">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm break-words leading-tight">
                  {reservation.showtime.theater.name}
                </span>
              </div>
            )}
          </>
        )}

        {reservation.reservationSeats &&
          reservation.reservationSeats.length > 0 && (
            <div className="pt-2 sm:pt-2.5 border-t">
              <p className="text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
                Seats
              </p>
              <div className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2">
                {reservation.reservationSeats.map((rs) => (
                  <span
                    key={rs.seat.id}
                    className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-primary/10 text-primary rounded text-xs sm:text-sm font-medium whitespace-nowrap"
                  >
                    {rs.seat.label}
                  </span>
                ))}
              </div>
            </div>
          )}

        <div className="flex items-center justify-between pt-2 sm:pt-2.5 border-t">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs sm:text-sm text-muted-foreground">
              Total Price
            </span>
          </div>
          <span className="text-base sm:text-lg md:text-xl font-bold">
            ${reservation.totalPrice}
          </span>
        </div>
      </CardContent>

      {(canCancel || onViewDetails) && (
        <CardFooter className="flex flex-col sm:flex-row gap-2 p-4 sm:p-6 pt-0">
          {reservation.status === "HELD" && onPayNow && (
            <Button
              onClick={() => onPayNow(reservation.id)}
              className="w-full sm:flex-1 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 text-xs sm:text-sm md:text-base py-2 sm:py-2.5 h-auto"
            >
              Pay Now - ${reservation.totalPrice}
            </Button>
          )}
          {onViewDetails && (
            <Button
              variant="outline"
              onClick={() => onViewDetails(reservation.id)}
              className="w-full sm:flex-1 text-xs sm:text-sm md:text-base py-2 sm:py-2.5 h-auto"
            >
              View Details
            </Button>
          )}
          {canCancel && onCancel && (
            <Button
              variant="destructive"
              onClick={() => onCancel(reservation.id)}
              className="w-full sm:flex-1 text-xs sm:text-sm md:text-base py-2 sm:py-2.5 h-auto"
            >
              Cancel Booking
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
