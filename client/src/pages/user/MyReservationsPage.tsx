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

export default function MyReservationsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");

  const { data, isLoading } = useReservations({
    page: 1,
    limit: 50,
  });

  const cancelMutation = useCancelReservation();

  const reservations = data?.data || [];

  const handleViewDetails = (reservationId: string) => {
    navigate(`/reservations/${reservationId}`);
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
      <div className="container max-w-5xl">
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
