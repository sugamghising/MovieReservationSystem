import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle, Calendar, Ticket, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useBookingStore } from "@/store";
import { format } from "date-fns";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const {
    movie,
    showtime,
    selectedSeats,
    totalPrice,
    reservationId,
    resetBooking,
  } = useBookingStore();

  useEffect(() => {
    // Redirect if no booking data
    if (!movie || !showtime || !reservationId) {
      navigate("/movies");
    }
  }, [movie, showtime, reservationId, navigate]);

  if (!movie || !showtime || !reservationId) {
    return null;
  }

  const handleNewBooking = () => {
    resetBooking();
    navigate("/movies");
  };

  return (
    <div className="min-h-screen py-8 bg-muted/50">
      <div className="container max-w-3xl">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 mb-4">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-lg text-muted-foreground">
            Your booking has been confirmed
          </p>
        </div>

        {/* Booking Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Reservation ID */}
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Reservation ID</p>
                <p className="font-mono font-semibold">{reservationId}</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>

            <Separator />

            {/* Movie Info */}
            <div className="flex items-start gap-4">
              {movie.posterUrl && (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-20 h-28 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2">{movie.title}</h3>
                {movie.genre && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {movie.genre}
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* Showtime Details */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium">
                    {format(
                      new Date(showtime.startTime),
                      "EEEE, MMMM dd, yyyy"
                    )}
                    {" at "}
                    {format(new Date(showtime.startTime), "h:mm a")}
                  </p>
                </div>
              </div>

              {showtime.theater && (
                <div className="flex items-center gap-3">
                  <Ticket className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Theater</p>
                    <p className="font-medium">{showtime.theater.name}</p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Seats */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Selected Seats ({selectedSeats.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seat) => (
                  <span
                    key={seat.id}
                    className="px-3 py-1 bg-primary/10 text-primary rounded font-medium"
                  >
                    {seat.seatNumber}
                  </span>
                ))}
              </div>
            </div>

            <Separator />

            {/* Total */}
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total Paid</span>
              <span className="text-2xl text-primary">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" className="flex-1" asChild>
            <Link to="/my-reservations">View My Bookings</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1"
            onClick={handleNewBooking}
          >
            Book Another Movie
          </Button>
        </div>

        {/* Confirmation Email Notice */}
        <div className="mt-8 p-4 bg-muted rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to your registered email address
            with your booking details and e-ticket.
          </p>
        </div>
      </div>
    </div>
  );
}
