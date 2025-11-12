import { Calendar, Clock, MapPin, Users, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { Showtime } from "@/types/models";
import type { SelectedSeat } from "@/store/bookingStore";
import { format } from "date-fns";

interface BookingSummaryProps {
  showtime: Showtime;
  selectedSeats: SelectedSeat[];
  totalPrice: number;
}

export default function BookingSummary({
  showtime,
  selectedSeats,
  totalPrice,
}: BookingSummaryProps) {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Movie Info */}
        {showtime.movie && (
          <div>
            <h3 className="font-semibold text-lg mb-2">
              {showtime.movie.title}
            </h3>
            {showtime.movie.genre && (
              <p className="text-sm text-muted-foreground">
                {showtime.movie.genre}
              </p>
            )}
          </div>
        )}

        <Separator />

        {/* Showtime Details */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Date</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(showtime.startTime), "EEEE, MMMM dd, yyyy")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Time</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(showtime.startTime), "h:mm a")}
                {showtime.endTime &&
                  ` - ${format(new Date(showtime.endTime), "h:mm a")}`}
              </p>
            </div>
          </div>

          {showtime.theater && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Theater</p>
                <p className="text-sm text-muted-foreground">
                  {showtime.theater.name}
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Selected Seats */}
        <div className="flex items-start gap-3">
          <Users className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium mb-2">
              Selected Seats ({selectedSeats.length})
            </p>
            {selectedSeats.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seat) => (
                  <span
                    key={seat.id}
                    className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium"
                  >
                    {seat.row}
                    {seat.number}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No seats selected</p>
            )}
          </div>
        </div>

        <Separator />

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Seat Price</span>
            <span>${showtime.price}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Number of Seats</span>
            <span>{selectedSeats.length}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total</span>
            <span className="text-2xl font-bold">${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment Info */}
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            Payment will be processed securely via Stripe
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
