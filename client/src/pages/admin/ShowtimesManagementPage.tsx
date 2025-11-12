import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useShowtimes, useDeleteShowtime } from "@/hooks/useShowtimes";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function ShowtimesManagementPage() {
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const { data: showtimesData, isLoading } = useShowtimes({});
  const deleteShowtime = useDeleteShowtime();

  const showtimes = showtimesData?.data || [];
  const filteredShowtimes = showtimes.filter((showtime) =>
    showtime.movie?.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this showtime? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await deleteShowtime.mutateAsync(id);
      toast({
        title: "Showtime Deleted",
        description: "The showtime has been deleted successfully.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the showtime. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Showtimes Management</h1>
            <p className="text-lg text-muted-foreground">
              Schedule and manage movie showtimes
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Showtime
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search showtimes by movie title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Showtimes Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              All Showtimes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredShowtimes && filteredShowtimes.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Movie</TableHead>
                    <TableHead>Theater</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Available Seats</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredShowtimes.map((showtime) => (
                    <TableRow key={showtime.id}>
                      <TableCell className="font-medium">
                        {showtime.movie?.title || "N/A"}
                      </TableCell>
                      <TableCell>{showtime.theater?.name || "N/A"}</TableCell>
                      <TableCell>
                        {format(
                          new Date(showtime.startTime),
                          "MMM dd, yyyy • h:mm a"
                        )}
                      </TableCell>
                      <TableCell>${showtime.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className="text-muted-foreground">
                          View Details
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(showtime.id)}
                            disabled={deleteShowtime.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  {search
                    ? "No showtimes found matching your search"
                    : "No showtimes scheduled yet"}
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Your First Showtime
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
