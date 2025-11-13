import { useState } from "react";
import { Ticket } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReservationCard from "@/components/reservations/ReservationCard";
import { useReservations, useCancelReservation } from "@/hooks/useReservations";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/common/EmptyState";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useBookingStore } from "@/store";

export default function MyReservationsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");

  const {
    setMovie,
    setShowtime,
    clearSeats,
    addSeat,
    setReservationId,
    calculateTotalPrice,
    goToStep,
  } = useBookingStore();

  const { data, isLoading } = useReservations({
    page: 1,
    limit: 50,
  });

  const cancelMutation = useCancelReservation();

  const reservations = data?.data || [];

  const handleViewDetails = (reservationId: string) => {
    navigate(`/reservations/${reservationId}`);
  };

  const handlePayNow = async (reservationId: string) => {
    try {
      // Find the reservation
      const reservation = reservations.find((r) => r.id === reservationId);

      if (!reservation || !reservation.showtime) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Reservation not found or incomplete.",
        });
        return;
      }

      console.log("Loading reservation for payment:", {
        reservationId,
        hasMovie: !!reservation.showtime.movie,
        hasShowtime: !!reservation.showtime,
        seatsCount:
          reservation.reservationSeats?.length ||
          reservation.seats?.length ||
          0,
        reservationData: reservation,
      });

      // Load reservation data into booking store
      if (reservation.showtime.movie) {
        setMovie(reservation.showtime.movie);
      }
      setShowtime(reservation.showtime);
      setReservationId(reservationId);

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
      } else {
        console.error("No seats found in reservation:", reservation);
        toast({
          variant: "destructive",
          title: "Error",
          description: "No seats found in this reservation.",
        });
        return;
      }

      // Calculate total price after adding all seats
      calculateTotalPrice();

      // Set to payment step
      goToStep(4);

      // Wait a bit longer to ensure Zustand store updates propagate
      await new Promise((resolve) => setTimeout(resolve, 150));

      console.log("Booking store populated, navigating to checkout...");

      // Navigate to checkout
      navigate(`/checkout/${reservationId}`);
    } catch (error) {
      console.error("Error in handlePayNow:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load reservation. Please try again.",
      });
    }
  };

  const handleCancel = async (reservationId: string) => {
    try {
      await cancelMutation.mutateAsync(reservationId);
      toast({
        title: "Reservation Cancelled",
        description: "Your reservation has been cancelled successfully.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel reservation. Please try again.",
      });
    }
  };

  const filterReservations = (status?: string) => {
    if (!status || status === "all") return reservations;
    return reservations.filter((r) => r.status === status);
  };

  const activeReservations = filterReservations("BOOKED");
  const cancelledReservations = filterReservations("CANCELLED");

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-5xl ml-8 md:ml-12 lg:ml-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Reservations</h1>
          <p className="text-lg text-muted-foreground">
            View and manage your movie bookings
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All ({reservations.length})</TabsTrigger>
            <TabsTrigger value="BOOKED">
              Active ({activeReservations.length})
            </TabsTrigger>
            <TabsTrigger value="CANCELLED">
              Cancelled ({cancelledReservations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="p-6">
                    <Skeleton className="h-24 w-full" />
                  </Card>
                ))}
              </div>
            ) : reservations.length > 0 ? (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onViewDetails={handleViewDetails}
                    onPayNow={handlePayNow}
                    onCancel={handleCancel}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Ticket}
                title="No reservations yet"
                description="Start booking your favorite movies"
                action={{
                  label: "Browse Movies",
                  onClick: () => navigate("/movies"),
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="BOOKED">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="p-6">
                    <Skeleton className="h-24 w-full" />
                  </Card>
                ))}
              </div>
            ) : activeReservations.length > 0 ? (
              <div className="space-y-4">
                {activeReservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onViewDetails={handleViewDetails}
                    onPayNow={handlePayNow}
                    onCancel={handleCancel}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Ticket}
                title="No active reservations"
                description="You don't have any active bookings"
                action={{
                  label: "Browse Movies",
                  onClick: () => navigate("/movies"),
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="CANCELLED">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="p-6">
                    <Skeleton className="h-24 w-full" />
                  </Card>
                ))}
              </div>
            ) : cancelledReservations.length > 0 ? (
              <div className="space-y-4">
                {cancelledReservations.map((reservation) => (
                  <ReservationCard
                    key={reservation.id}
                    reservation={reservation}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Ticket}
                title="No cancelled reservations"
                description="You haven't cancelled any bookings"
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
