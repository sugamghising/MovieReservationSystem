import { useState } from "react";
import { Loader2, Calendar, AlertCircle } from "lucide-react";
import ReservationCard from "./ReservationCard";
import { useReservations, useCancelReservation } from "@/hooks";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ReservationList() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cancelReservationId, setCancelReservationId] = useState<string | null>(
    null
  );
  const { toast } = useToast();

  const { data, isLoading, error, refetch } = useReservations({
    page,
    limit: 10,
    status: statusFilter !== "all" ? statusFilter : undefined,
  });

  const cancelMutation = useCancelReservation();

  const handleCancelReservation = async () => {
    if (!cancelReservationId) return;

    try {
      await cancelMutation.mutateAsync(cancelReservationId);
      toast({
        title: "Reservation Cancelled",
        description: "Your reservation has been cancelled successfully.",
      });
      setCancelReservationId(null);
      refetch();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to cancel reservation.";
      toast({
        title: "Cancellation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          Error Loading Reservations
        </h3>
        <p className="text-muted-foreground mb-4">
          {error.message || "Failed to load your reservations"}
        </p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  const reservations = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      {/* Header with Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">My Reservations</h2>
          <p className="text-muted-foreground">
            View and manage your movie bookings
          </p>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reservations</SelectItem>
            <SelectItem value="HELD">Held</SelectItem>
            <SelectItem value="BOOKED">Booked</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
            <SelectItem value="EXPIRED">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reservations Grid */}
      {reservations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Reservations Found</h3>
          <p className="text-muted-foreground mb-4">
            {statusFilter !== "all"
              ? `You don't have any ${statusFilter.toLowerCase()} reservations.`
              : "You haven't made any reservations yet."}
          </p>
          <Button onClick={() => (window.location.href = "/movies")}>
            Browse Movies
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                reservation={reservation}
                onCancel={(id) => setCancelReservationId(id)}
                onViewDetails={(id) =>
                  (window.location.href = `/reservations/${id}`)
                }
              />
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!meta.hasPreviousPage}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-4">
                Page {meta.currentPage} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={!meta.hasNextPage}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Cancel Confirmation Dialog */}
      <AlertDialog
        open={!!cancelReservationId}
        onOpenChange={(open) => !open && setCancelReservationId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Reservation?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this reservation? This action
              cannot be undone. If you have already paid, a refund will be
              processed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Reservation</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelReservation}
              className="bg-destructive hover:bg-destructive/90"
            >
              {cancelMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Cancelling...
                </>
              ) : (
                "Cancel Reservation"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
