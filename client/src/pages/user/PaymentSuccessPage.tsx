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
    <div className="min-h-screen py-8 bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container max-w-3xl">
        {/* Enhanced Success Message */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-6 shadow-2xl shadow-green-500/50 animate-pulse-glow">
            <CheckCircle className="h-14 w-14 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Payment Successful!
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Your movie tickets are confirmed and ready
          </p>
        </div>

        {/* Enhanced Booking Details */}
        <Card className="mb-6 border-0 shadow-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Ticket className="h-6 w-6" />
              Booking Confirmation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {/* Reservation ID */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg">
              <div>
                <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                  Reservation ID
                </p>
                <p className="font-mono font-bold text-lg">{reservationId}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-green-500/20 hover:bg-green-500/10"
              >
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
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold">Date & Time</p>
                  <p className="text-sm text-muted-foreground">
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
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <Ticket className="h-5 w-5 text-primary flex-shrink-0" />
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

            {/* Seats */}
            <div>
              <p className="text-sm font-semibold mb-3">
                Selected Seats ({selectedSeats.length})
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedSeats.map((seat) => (
                  <div
                    key={seat.id}
                    className="px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm font-bold shadow-md"
                  >
                    {seat.seatNumber}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Total */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg">
              <span className="text-lg font-semibold">Total Paid</span>
              <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button
            size="lg"
            className="flex-1 h-14 text-base font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
            asChild
          >
            <Link to="/my-reservations">
              <Ticket className="h-5 w-5 mr-2" />
              View My Bookings
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1 h-14 text-base font-semibold hover:bg-muted transition-all"
            onClick={handleNewBooking}
          >
            Book Another Movie
          </Button>
        </div>

        {/* Enhanced Confirmation Notice */}
        <div className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg text-center">
          <p className="text-sm font-medium text-foreground mb-2">
            📧 Confirmation Email Sent
          </p>
          <p className="text-sm text-muted-foreground">
            A confirmation email with your booking details and e-ticket has been
            sent to your registered email address.
          </p>
        </div>
      </div>
    </div>
  );
}
