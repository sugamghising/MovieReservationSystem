import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import SeatMap from "@/components/booking/SeatMap";
import BookingSummary from "@/components/booking/BookingSummary";
import { useBookingStore } from "@/store";
import { useAvailableSeats } from "@/hooks/useShowtimes";
import { useCreateReservation } from "@/hooks/useReservations";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/common/EmptyState";
import { Ticket } from "lucide-react";
import type { Seat } from "@/types/models";
import type { Seat as ApiSeat } from "@/api/types";
import { toast } from "react-hot-toast";

export default function BookingPage() {
  const navigate = useNavigate();
  const [isCreatingReservation, setIsCreatingReservation] = useState(false);
  const {
    movie,
    showtime,
    selectedSeats,
    currentStep,
    totalPrice,
    addSeat,
    removeSeat,
    calculateTotalPrice,
    nextStep,
    previousStep,
    setReservationId,
  } = useBookingStore();

  // Fetch available seats for the showtime
  const { data: seatsData, isLoading } = useAvailableSeats(showtime?.id || "");
  const createReservation = useCreateReservation();

  // Transform API seats to extended seats with computed properties
  const seats: Seat[] = useMemo(
    () =>
      (seatsData?.seats || []).map((seat: ApiSeat) => {
        return {
          ...seat,
          row: seat.row || "",
          number: seat.number || 0,
          status: "AVAILABLE" as const,
        };
      }),
    [seatsData]
  );

  useEffect(() => {
    // Redirect if no movie or showtime selected
    if (!movie || !showtime) {
      navigate("/movies");
    }
  }, [movie, showtime, navigate]);

  useEffect(() => {
    // Recalculate total price when seats change
    if (showtime) {
      calculateTotalPrice();
    }
  }, [selectedSeats, showtime, calculateTotalPrice]);

  if (!movie || !showtime) {
    return null;
  }

  const handleSeatSelect = (seatId: string) => {
    const seat = seats.find((s) => s.id === seatId);
    if (!seat) return;

    if (selectedSeats.some((s) => s.id === seatId)) {
      removeSeat(seatId);
    } else {
      addSeat({
        id: seat.id,
        row: seat.row || "",
        number: seat.number || 0,
        seatNumber: seat.label, // Use label as seatNumber
        price: showtime.price,
      });
    }
  };

  const handleContinue = async () => {
    if (selectedSeats.length === 0) {
      return;
    }

    if (!showtime?.id) {
      toast.error("Invalid showtime selected");
      return;
    }

    setIsCreatingReservation(true);

    try {
      // Create reservation with showtime and selected seat IDs (as strings/UUIDs)
      const seatIds = selectedSeats.map((seat) => seat.id);
      const response = await createReservation.mutateAsync({
        showtimeId: showtime.id,
        seatIds: seatIds,
      });

      // Store the reservation ID in booking store
      setReservationId(response.reservation.id);

      // Move to next step and navigate to checkout/payment
      nextStep();
      navigate("/checkout");
    } catch (error) {
      toast.error("Failed to create reservation. Please try again.");
      console.error("Reservation creation error:", error);
    } finally {
      setIsCreatingReservation(false);
    }
  };

  const steps = [
    { number: 1, name: "Select Movie", complete: true },
    { number: 2, name: "Select Showtime", complete: true },
    { number: 3, name: "Select Seats", complete: false },
    { number: 4, name: "Payment", complete: false },
    { number: 5, name: "Confirmation", complete: false },
  ];

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 py-8">
      <div className="container">
        {/* Header with Enhanced Visual */}
        <div className="mb-8 space-y-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="group hover:bg-primary/10 transition-all"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back
          </Button>

          {/* Movie Title Banner */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 p-6 text-white shadow-2xl">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Ticket className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-wider opacity-90">
                  Now Booking
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {movie.title}
              </h1>
              <p className="text-sm md:text-base opacity-90">
                {movie.genre}
                {movie.releaseDate &&
                  ` • ${new Date(movie.releaseDate).getFullYear()}`}
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <Card className="mb-8 border-0 shadow-lg bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                {steps.map((step, index) => (
                  <div
                    key={step.number}
                    className="flex flex-col items-center relative"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 font-semibold transition-all duration-300 ${
                        step.number < currentStep
                          ? "bg-green-500 text-white shadow-lg shadow-green-500/50"
                          : step.number === currentStep
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50 scale-110"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.number < currentStep ? "✓" : step.number}
                    </div>
                    <span
                      className={`text-xs text-center hidden sm:block font-medium ${
                        step.number <= currentStep
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.name}
                    </span>
                    {index < steps.length - 1 && (
                      <div
                        className={`absolute top-5 left-1/2 w-full h-0.5 -z-10 transition-all duration-300 ${
                          step.number < currentStep
                            ? "bg-green-500"
                            : "bg-muted"
                        }`}
                        style={{ transform: "translateY(-50%)" }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <Progress value={progress} className="h-2.5 shadow-inner" />
            </div>
          </CardContent>
        </Card>

        {/* Main Content - Enhanced Layout */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Seat Map - Enhanced Card */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl overflow-hidden">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-6 space-y-4">
                    <Skeleton className="h-8 w-full" />
                    {[...Array(10)].map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                ) : seats.length > 0 ? (
                  <div className="p-6">
                    {/* Theater Header */}
                    <div className="mb-6 text-center">
                      <h3 className="text-xl font-bold mb-1">
                        {showtime.theater?.name || "Theater"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Select your preferred seats
                      </p>
                    </div>

                    <SeatMap
                      seats={seats}
                      selectedSeats={selectedSeats.map((s) => s.id)}
                      onSeatSelect={handleSeatSelect}
                    />

                    {/* Enhanced Legend */}
                    <div className="mt-8 p-4 bg-muted/30 rounded-lg">
                      <div className="flex flex-wrap gap-6 justify-center">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-t-lg border-2 border-border bg-background shadow-sm" />
                          <span className="text-sm font-medium">Available</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-t-lg border-2 border-primary bg-primary shadow-lg shadow-primary/50" />
                          <span className="text-sm font-medium">Selected</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-t-lg border-2 border-muted bg-muted opacity-50" />
                          <span className="text-sm font-medium">Occupied</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-12">
                    <EmptyState
                      icon={Ticket}
                      title="No seats available"
                      description="All seats are currently occupied"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Summary - Sticky Enhanced */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-4 space-y-4">
              <BookingSummary
                showtime={showtime}
                selectedSeats={selectedSeats}
                totalPrice={totalPrice}
              />

              {/* Enhanced Action Buttons */}
              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full h-14 text-base font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700"
                  onClick={handleContinue}
                  disabled={selectedSeats.length === 0 || isCreatingReservation}
                >
                  {isCreatingReservation ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2" />
                      Creating Reservation...
                    </>
                  ) : (
                    <>
                      Continue to Payment
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full h-12 hover:bg-muted transition-all"
                  onClick={previousStep}
                  disabled={isCreatingReservation}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Showtimes
                </Button>
              </div>

              {selectedSeats.length === 0 ? (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                  <p className="text-sm text-amber-700 dark:text-amber-400 text-center font-medium">
                    Please select at least one seat to continue
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-400 text-center font-medium">
                    {selectedSeats.length} seat
                    {selectedSeats.length > 1 ? "s" : ""} selected
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
