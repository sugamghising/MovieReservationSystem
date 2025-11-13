import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  CreditCard,
  Download,
  Share2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { Reservation } from "@/types/models";
import { format } from "date-fns";

interface ReservationConfirmationProps {
  reservation: Reservation;
  onViewDetails?: () => void;
  onBackToHome?: () => void;
}

export default function ReservationConfirmation({
  reservation,
  onViewDetails,
  onBackToHome,
}: ReservationConfirmationProps) {
  const handleDownload = () => {
    // TODO: Implement ticket download functionality
    console.log("Downloading ticket...");
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    if (navigator.share) {
      navigator.share({
        title: "Movie Reservation",
        text: `I booked tickets for ${reservation.showtime?.movie?.title}!`,
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Success Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            Your reservation has been successfully confirmed
          </p>
        </div>
        <Badge variant="default" className="text-base px-4 py-1">
          Booking ID: {reservation.id}
        </Badge>
      </div>

      {/* Reservation Details Card */}
      <Card>
        <CardHeader className="pb-4">
          {reservation.showtime?.movie && (
            <div className="flex gap-4">
              {reservation.showtime.movie.posterUrl && (
                <img
                  src={reservation.showtime.movie.posterUrl}
                  alt={reservation.showtime.movie.title}
                  className="w-24 h-36 object-cover rounded-md"
                />
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">
                  {reservation.showtime.movie.title}
                </h2>
                <div className="flex items-center gap-3 text-sm">
                  <Badge variant="outline">
                    {reservation.showtime.movie.genre}
                  </Badge>
                  <span className="text-muted-foreground">
                    {reservation.showtime.movie.durationMin} min
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <Separator />

          {/* Date & Time */}
          {reservation.showtime && (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1">Date</p>
                  <p className="text-sm text-muted-foreground">
                    {format(
                      new Date(reservation.showtime.startTime),
                      "EEEE, MMM dd, yyyy"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1">Time</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(reservation.showtime.startTime), "h:mm a")}
                  </p>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Theater */}
          {reservation.showtime?.theater && (
            <>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium mb-1">Theater</p>
                  <p className="text-sm text-muted-foreground">
                    {reservation.showtime.theater.name}
                  </p>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Seats */}
          {reservation.reservationSeats &&
            reservation.reservationSeats.length > 0 && (
              <>
                <div className="flex items-start gap-3">
                  <Ticket className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium mb-2">Selected Seats</p>
                    <div className="flex flex-wrap gap-2">
                      {reservation.reservationSeats.map((rs) => (
                        <span
                          key={rs.seat.id}
                          className="px-3 py-1.5 bg-primary/10 text-primary rounded-md font-medium text-sm"
                        >
                          {rs.seat.rowLabel}-{rs.seat.seatNumber}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <Separator />
              </>
            )}

          {/* Price */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">Total Amount</span>
            </div>
            <span className="text-2xl font-bold">
              ${reservation.totalPrice}
            </span>
          </div>

          {/* Payment Status */}
          {reservation.payment && (
            <>
              <Separator />
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
            </>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="flex-1"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Ticket
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
          <div className="flex gap-2 w-full">
            {onViewDetails && (
              <Button
                variant="default"
                className="flex-1"
                onClick={onViewDetails}
              >
                View Full Details
              </Button>
            )}
            {onBackToHome && (
              <Button
                variant="secondary"
                className="flex-1"
                onClick={onBackToHome}
              >
                Back to Home
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Important Notice */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">Important Information</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Please arrive at least 15 minutes before showtime</li>
            <li>• Bring a valid ID for verification</li>
            <li>
              • Screenshots of this confirmation will be accepted at the theater
            </li>
            <li>• Cancellations are allowed up to 2 hours before showtime</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
