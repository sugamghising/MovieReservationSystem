import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import SeatMap from "@/components/booking/SeatMap";
import BookingSummary from "@/components/booking/BookingSummary";
import { useBookingStore } from "@/store";
import { useAvailableSeats } from "@/hooks/useShowtimes";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/common/EmptyState";
import { Ticket } from "lucide-react";
import type { Seat } from "@/types/models";
import type { Seat as ApiSeat } from "@/api/types";

export default function BookingPage() {
  const navigate = useNavigate();
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
  } = useBookingStore();

  // Fetch available seats for the showtime
  const { data: seatsData, isLoading } = useAvailableSeats(showtime?.id || "");

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

  const handleContinue = () => {
    if (selectedSeats.length === 0) {
      return;
    }
    nextStep();
    navigate("/checkout");
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
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-4xl font-bold mb-2">Select Your Seats</h1>
          <p className="text-lg text-muted-foreground">
            Choose your preferred seats for the show
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className={`flex flex-col items-center ${
                      step.number <= currentStep
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                        step.number <= currentStep
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {step.number}
                    </div>
                    <span className="text-xs text-center hidden sm:block">
                      {step.name}
                    </span>
                  </div>
                ))}
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Seat Map */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-full" />
                    {[...Array(10)].map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                ) : seats.length > 0 ? (
                  <>
                    <SeatMap
                      seats={seats}
                      selectedSeats={selectedSeats.map((s) => s.id)}
                      onSeatSelect={handleSeatSelect}
                    />

                    {/* Legend */}
                    <div className="mt-8 flex flex-wrap gap-4 justify-center">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-t-lg border-2 border-border bg-background" />
                        <span className="text-sm">Available</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-t-lg border-2 border-primary bg-primary" />
                        <span className="text-sm">Selected</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-t-lg border-2 border-muted bg-muted opacity-50" />
                        <span className="text-sm">Occupied</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <EmptyState
                    icon={Ticket}
                    title="No seats available"
                    description="All seats are currently occupied"
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-4 space-y-4">
              <BookingSummary
                showtime={showtime}
                selectedSeats={selectedSeats}
                totalPrice={totalPrice}
              />

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleContinue}
                  disabled={selectedSeats.length === 0}
                >
                  Continue to Payment
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={previousStep}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </div>

              {selectedSeats.length === 0 && (
                <p className="text-sm text-muted-foreground text-center">
                  Please select at least one seat to continue
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
