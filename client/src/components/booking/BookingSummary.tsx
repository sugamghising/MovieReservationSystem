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
    <Card className="border-0 shadow-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-rose-600 to-purple-600 text-white pb-4">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Booking Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {/* Movie Info */}
        {showtime.movie && (
          <div className="pb-4">
            <h3 className="font-bold text-xl mb-1">{showtime.movie.title}</h3>
            {showtime.movie.genre && (
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-primary" />
                {showtime.movie.genre}
              </p>
            )}
          </div>
        )}

        <Separator />

        {/* Showtime Details */}
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <Calendar className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">Date</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(showtime.startTime), "EEEE, MMMM dd, yyyy")}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">Time</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(showtime.startTime), "h:mm a")}
                {showtime.endTime &&
                  ` - ${format(new Date(showtime.endTime), "h:mm a")}`}
              </p>
            </div>
          </div>

          {showtime.theater && (
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold">Theater</p>
                <p className="text-sm text-muted-foreground">
                  {showtime.theater.name}
                </p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Selected Seats */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <p className="text-sm font-semibold">
              Selected Seats ({selectedSeats.length})
            </p>
          </div>
          {selectedSeats.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((seat) => (
                <div
                  key={seat.id}
                  className="px-3 py-2 bg-gradient-to-r from-rose-500 to-purple-500 text-white rounded-lg text-xs font-bold shadow-md hover:shadow-lg transition-shadow"
                >
                  {seat.row}
                  {seat.number}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No seats selected yet
            </p>
          )}
        </div>

        <Separator />

        {/* Pricing */}
        <div className="space-y-3 bg-muted/20 p-4 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Seat Price</span>
            <span className="font-semibold">${showtime.price.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Number of Seats</span>
            <span className="font-semibold">{selectedSeats.length}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between items-center pt-2">
            <span className="font-bold text-lg">Total</span>
            <span className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
              ${totalPrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Payment Info */}
        <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <CreditCard className="h-4 w-4 text-green-600" />
          <p className="text-xs text-green-700 dark:text-green-400">
            Secure payment processing with Stripe
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
