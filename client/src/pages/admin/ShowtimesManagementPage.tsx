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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  useShowtimes,
  useDeleteShowtime,
  useCreateShowtime,
  useUpdateShowtime,
} from "@/hooks/useShowtimes";
import { useMovies } from "@/hooks/useMovies";
import { useTheaters } from "@/hooks/useTheaters";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { Showtime } from "@/types/models";

interface ShowtimeFormData {
  movieId: string;
  theaterId: string;
  startTime: string;
  endTime: string;
  price: number;
}

export default function ShowtimesManagementPage() {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState<Showtime | null>(null);
  const [formData, setFormData] = useState<ShowtimeFormData>({
    movieId: "",
    theaterId: "",
    startTime: "",
    endTime: "",
    price: 0,
  });
  const { toast } = useToast();

  const { data: showtimesData, isLoading } = useShowtimes({});
  const { data: moviesData } = useMovies({});
  const { data: theatersData } = useTheaters({});
  const deleteShowtime = useDeleteShowtime();
  const createShowtime = useCreateShowtime();
  const updateShowtime = useUpdateShowtime();

  const showtimes = showtimesData?.data || [];
  const movies = moviesData?.data || [];
  const theaters = theatersData?.data || [];

  const filteredShowtimes = showtimes.filter((showtime) =>
    showtime.movie?.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDialog = (showtime?: Showtime) => {
    if (showtime) {
      setEditingShowtime(showtime);
      setFormData({
        movieId: showtime.movieId,
        theaterId: showtime.theaterId,
        startTime: format(new Date(showtime.startTime), "yyyy-MM-dd'T'HH:mm"),
        endTime: format(new Date(showtime.endTime), "yyyy-MM-dd'T'HH:mm"),
        price: showtime.price,
      });
    } else {
      setEditingShowtime(null);
      setFormData({
        movieId: "",
        theaterId: "",
        startTime: "",
        endTime: "",
        price: 0,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingShowtime(null);
    setFormData({
      movieId: "",
      theaterId: "",
      startTime: "",
      endTime: "",
      price: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.movieId ||
      !formData.theaterId ||
      !formData.startTime ||
      !formData.endTime ||
      formData.price <= 0
    ) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields with valid values.",
      });
      return;
    }

    try {
      if (editingShowtime) {
        await updateShowtime.mutateAsync({
          id: editingShowtime.id,
          data: {
            startTime: new Date(formData.startTime).toISOString(),
            endTime: new Date(formData.endTime).toISOString(),
            price: formData.price,
          },
        });
        toast({
          title: "Showtime Updated",
          description: "The showtime has been updated successfully.",
        });
      } else {
        await createShowtime.mutateAsync({
          movieId: formData.movieId,
          theaterId: formData.theaterId,
          startTime: new Date(formData.startTime).toISOString(),
          endTime: new Date(formData.endTime).toISOString(),
          price: formData.price,
        });
        toast({
          title: "Showtime Created",
          description: "The showtime has been created successfully.",
        });
      }
      handleCloseDialog();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${
          editingShowtime ? "update" : "create"
        } showtime. Please try again.`,
      });
    }
  };

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
          <Button onClick={() => handleOpenDialog()}>
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
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(showtime)}
                          >
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
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Your First Showtime
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Showtime Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl bg-zinc-900 border-zinc-800 max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl text-white">
                {editingShowtime ? "Edit Showtime" : "Add New Showtime"}
              </DialogTitle>
              <DialogDescription className="text-zinc-400">
                {editingShowtime
                  ? "Update the showtime details below"
                  : "Fill in the details to schedule a new showtime"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="movieId" className="text-white font-semibold">
                    Movie <span className="text-rose-500">*</span>
                  </Label>
                  <Select
                    value={formData.movieId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, movieId: value })
                    }
                    disabled={!!editingShowtime}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue placeholder="Select a movie" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {movies.map((movie) => (
                        <SelectItem
                          key={movie.id}
                          value={movie.id}
                          className="text-white"
                        >
                          {movie.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="theaterId"
                    className="text-white font-semibold"
                  >
                    Theater <span className="text-rose-500">*</span>
                  </Label>
                  <Select
                    value={formData.theaterId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, theaterId: value })
                    }
                    disabled={!!editingShowtime}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue placeholder="Select a theater" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700">
                      {theaters.map((theater) => (
                        <SelectItem
                          key={theater.id}
                          value={theater.id}
                          className="text-white"
                        >
                          {theater.name} ({theater.capacity} seats)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="startTime"
                      className="text-white font-semibold"
                    >
                      Start Time <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="startTime"
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(e) =>
                        setFormData({ ...formData, startTime: e.target.value })
                      }
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label
                      htmlFor="endTime"
                      className="text-white font-semibold"
                    >
                      End Time <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="endTime"
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={(e) =>
                        setFormData({ ...formData, endTime: e.target.value })
                      }
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="price" className="text-white font-semibold">
                    Price (USD) <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="e.g. 12.50"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    required
                  />
                </div>
              </div>

              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  className="border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={
                    createShowtime.isPending || updateShowtime.isPending
                  }
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                >
                  {createShowtime.isPending || updateShowtime.isPending
                    ? "Saving..."
                    : editingShowtime
                    ? "Update Showtime"
                    : "Create Showtime"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
