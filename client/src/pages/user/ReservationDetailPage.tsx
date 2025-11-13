import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ReservationDetail from "@/components/reservations/ReservationDetail";
import { useReservation, useCancelReservation } from "@/hooks/useReservations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBookingStore } from "@/store";

export default function ReservationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const {
    setMovie,
    setShowtime,
    clearSeats,
    addSeat,
    setReservationId,
    calculateTotalPrice,
    goToStep,
  } = useBookingStore();

  const { data: reservationData, isLoading } = useReservation(id || "");
  const cancelMutation = useCancelReservation();

  const reservation = reservationData?.reservation;

  useEffect(() => {
    if (!id) {
      navigate("/my-reservations");
    }
  }, [id, navigate]);

  const handleCancel = async (reservationId: string) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this reservation? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await cancelMutation.mutateAsync(reservationId);
      toast({
        title: "Reservation Cancelled",
        description: "Your reservation has been cancelled successfully.",
      });
      navigate("/my-reservations");
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel reservation. Please try again.",
      });
    }
  };

  const handleProceedToPayment = async () => {
    if (!reservation) return;

    setIsProcessingPayment(true);

    try {
      // Load reservation data into booking store
      if (reservation.showtime?.movie) {
        setMovie(reservation.showtime.movie);
      }
      if (reservation.showtime) {
        setShowtime(reservation.showtime);
      }
      setReservationId(reservation.id);

      // Load selected seats
      clearSeats();

      // The backend returns 'seats' in list view but 'reservationSeats' in detail view
      const seatData = reservation.seats || reservation.reservationSeats;

      if (seatData && seatData.length > 0) {
        seatData.forEach((rs) => {
          addSeat({
            id: rs.seat.id,
            seatNumber: rs.seat.label,
            row: rs.seat.row || "",
            number: rs.seat.number || 0,
            price: reservation.showtime!.price,
          });
        });
      }

      // Calculate total price after adding all seats
      calculateTotalPrice();

      // Set to payment step
      goToStep(4);

      // Wait to ensure Zustand store updates propagate
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Navigate to checkout
      navigate(`/checkout/${reservation.id}`);
    } catch (error) {
      console.error("Error loading reservation:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load reservation. Please try again.",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="min-h-screen py-8">
        <div className="container max-w-5xl ml-8 md:ml-12 lg:ml-16">
          <Button
            variant="ghost"
            onClick={() => navigate("/my-reservations")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reservations
          </Button>
          <Alert variant="destructive">
            <AlertDescription>
              Reservation not found. It may have been cancelled or does not
              exist.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container max-w-7xl ml-8 md:ml-12 lg:ml-16">
        <Button
          variant="ghost"
          onClick={() => navigate("/my-reservations")}
          className="mb-6 hover:bg-primary/10 transition-all group"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Reservations
        </Button>

        {/* Payment Action for HELD Reservations */}
        {reservation.status === "HELD" && (
          <Card className="mb-6 border-amber-500/50 bg-amber-500/5">
            <CardHeader>
              <CardTitle className="text-amber-600 dark:text-amber-400">
                Payment Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This reservation is on hold. Complete your payment to confirm
                your booking. Your seats are reserved for a limited time.
              </p>
              <Button
                size="lg"
                className="w-full md:w-auto bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700"
                onClick={handleProceedToPayment}
                disabled={isProcessingPayment}
              >
                {isProcessingPayment ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>Complete Payment - ${reservation.totalPrice}</>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        <ReservationDetail
          reservation={reservation}
          isLoading={isLoading}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
