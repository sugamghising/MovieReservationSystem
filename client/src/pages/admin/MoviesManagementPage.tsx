import { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  useMovies,
  useDeleteMovie,
  useCreateMovie,
  useUpdateMovie,
} from "@/hooks/useMovies";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { Movie } from "@/types/models";

interface MovieFormData {
  title: string;
  description: string;
  genre: string;
  durationMinute: number;
  posterUrl: string;
}

export default function MoviesManagementPage() {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [formData, setFormData] = useState<MovieFormData>({
    title: "",
    description: "",
    genre: "",
    durationMinute: 0,
    posterUrl: "",
  });
  const { toast } = useToast();

  const { data: moviesData, isLoading } = useMovies({ search });
  const deleteMovie = useDeleteMovie();
  const createMovie = useCreateMovie();
  const updateMovie = useUpdateMovie();

  const movies = moviesData?.data || [];

  const handleOpenDialog = (movie?: Movie) => {
    if (movie) {
      setEditingMovie(movie);
      setFormData({
        title: movie.title,
        description: movie.description || "",
        genre: movie.genre,
        durationMinute: movie.durationMin,
        posterUrl: movie.posterUrl || "",
      });
    } else {
      setEditingMovie(null);
      setFormData({
        title: "",
        description: "",
        genre: "",
        durationMinute: 0,
        posterUrl: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingMovie(null);
    setFormData({
      title: "",
      description: "",
      genre: "",
      durationMinute: 0,
      posterUrl: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.genre || formData.durationMinute <= 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields.",
      });
      return;
    }

    try {
      if (editingMovie) {
        await updateMovie.mutateAsync({
          id: editingMovie.id,
          data: formData,
        });
        toast({
          title: "Movie Updated",
          description: `"${formData.title}" has been updated successfully.`,
        });
      } else {
        await createMovie.mutateAsync(formData);
        toast({
          title: "Movie Created",
          description: `"${formData.title}" has been created successfully.`,
        });
      }
      handleCloseDialog();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${
          editingMovie ? "update" : "create"
        } movie. Please try again.`,
      });
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteMovie.mutateAsync(id);
      toast({
        title: "Movie Deleted",
        description: `"${title}" has been deleted successfully.`,
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete the movie. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Movies Management</h1>
            <p className="text-lg text-muted-foreground">
              Manage your movie catalog
            </p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Movie
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search movies by title or genre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Movies Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Movies</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : movies && movies.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Poster</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Genre</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Release Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movies.map((movie) => (
                    <TableRow key={movie.id}>
                      <TableCell>
                        <img
                          src={movie.posterUrl || ""}
                          alt={movie.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {movie.title}
                      </TableCell>
                      <TableCell>{movie.genre}</TableCell>
                      <TableCell>{movie.durationMin} min</TableCell>
                      <TableCell>
                        {movie.releaseDate
                          ? format(new Date(movie.releaseDate), "MMM dd, yyyy")
                          : "N/A"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenDialog(movie)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(movie.id, movie.title)}
                            disabled={deleteMovie.isPending}
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
                    ? "No movies found matching your search"
                    : "No movies yet"}
                </p>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Movie
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Movie Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl bg-zinc-900 border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-2xl text-white">
                {editingMovie ? "Edit Movie" : "Add New Movie"}
              </DialogTitle>
              <DialogDescription className="text-zinc-400">
                {editingMovie
                  ? "Update the movie details below"
                  : "Fill in the details to add a new movie"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title" className="text-white font-semibold">
                    Title <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter movie title"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="description"
                    className="text-white font-semibold"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter movie description"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="genre" className="text-white font-semibold">
                      Genre <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="genre"
                      value={formData.genre}
                      onChange={(e) =>
                        setFormData({ ...formData, genre: e.target.value })
                      }
                      placeholder="e.g. Action, Drama"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label
                      htmlFor="durationMinute"
                      className="text-white font-semibold"
                    >
                      Duration (minutes){" "}
                      <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="durationMinute"
                      type="number"
                      min="1"
                      value={formData.durationMinute || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          durationMinute: parseInt(e.target.value) || 0,
                        })
                      }
                      placeholder="120"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="posterUrl"
                    className="text-white font-semibold"
                  >
                    Poster URL
                  </Label>
                  <Input
                    id="posterUrl"
                    value={formData.posterUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, posterUrl: e.target.value })
                    }
                    placeholder="https://example.com/poster.jpg"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
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
                  disabled={createMovie.isPending || updateMovie.isPending}
                  className="bg-rose-600 hover:bg-rose-700 text-white"
                >
                  {createMovie.isPending || updateMovie.isPending
                    ? "Saving..."
                    : editingMovie
                    ? "Update Movie"
                    : "Create Movie"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
