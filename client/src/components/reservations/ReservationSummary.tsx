import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  CreditCard,
  Film,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Showtime, Seat } from "@/types/models";
import { format } from "date-fns";

interface ReservationSummaryProps {
  showtime: Showtime;
  selectedSeats: Seat[];
  onConfirm?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function ReservationSummary({
  showtime,
  selectedSeats,
  onConfirm,
  onCancel,
  isLoading,
}: ReservationSummaryProps) {
  const totalPrice = selectedSeats.length * showtime.price;
  const taxAmount = totalPrice * 0.1; // 10% tax
  const finalPrice = totalPrice + taxAmount;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Booking Summary</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Movie Info */}
        {showtime.movie && (
          <>
            <div className="flex items-start gap-3">
              <Film className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">{showtime.movie.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {showtime.movie.genre}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {showtime.movie.durationMin} min
                  </span>
                </div>
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Date & Time */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <p className="font-medium">
                {format(new Date(showtime.startTime), "EEEE, MMM dd, yyyy")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div className="text-sm">
              <p className="font-medium">
                {format(new Date(showtime.startTime), "h:mm a")}
              </p>
            </div>
          </div>

          {showtime.theater && (
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <p className="font-medium">{showtime.theater.name}</p>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Selected Seats */}
        {selectedSeats.length > 0 && (
          <>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Ticket className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">
                  Selected Seats ({selectedSeats.length})
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seat) => (
                  <span
                    key={seat.id}
                    className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium"
                  >
                    {seat.row || ""}
                    {seat.number || seat.label}
                  </span>
                ))}
              </div>
            </div>
            <Separator />
          </>
        )}

        {/* Price Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <p className="text-sm font-medium">Price Details</p>
          </div>

          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Ticket Price ({selectedSeats.length} × ${showtime.price})
              </span>
              <span className="font-medium">${totalPrice.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-muted-foreground">Service Tax (10%)</span>
              <span className="font-medium">${taxAmount.toFixed(2)}</span>
            </div>
          </div>

          <Separator className="my-2" />

          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Amount</span>
            <span className="text-2xl font-bold">${finalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Terms */}
        <div className="bg-muted/50 p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">
            By proceeding, you agree to our terms and conditions. Cancellations
            are allowed up to 2 hours before showtime.
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        {onConfirm && (
          <Button
            className="w-full"
            size="lg"
            onClick={onConfirm}
            disabled={isLoading || selectedSeats.length === 0}
          >
            {isLoading ? "Processing..." : "Confirm Booking"}
          </Button>
        )}
        {onCancel && (
          <Button
            variant="outline"
            className="w-full"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
