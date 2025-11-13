import { useParams, Link } from "react-router-dom";
import { Calendar, Clock, Film, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ShowtimeCard from "@/components/showtimes/ShowtimeCard";
import { useMovieDetail } from "@/hooks/useMovies";
import { useShowtimesByMovie } from "@/hooks/useShowtimes";
import { useNavigate } from "react-router-dom";
import { useBookingStore } from "@/store";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setMovie, setShowtime } = useBookingStore();

  const { data: movieData, isLoading: movieLoading } = useMovieDetail(id!);
  const { data: showtimesData, isLoading: showtimesLoading } =
    useShowtimesByMovie(id!);

  const movie = movieData?.movie;
  const showtimes = showtimesData?.showtimes || [];

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (movieLoading) {
    return (
      <div className="min-h-screen py-8">
        <div className="container ml-8 md:ml-12 lg:ml-16">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen py-8">
        <div className="container ml-8 md:ml-12 lg:ml-16">
          <Card>
            <CardContent className="p-12 text-center">
              <Film className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-bold mb-2">Movie not found</h2>
              <p className="text-muted-foreground mb-4">
                The movie you're looking for doesn't exist.
              </p>
              <Button asChild>
                <Link to="/movies">Browse Movies</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container ml-8 md:ml-12 lg:ml-16">
        {/* Back Button */}
        <Button variant="ghost" className="mb-8" asChild>
          <Link to="/movies">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Movies
          </Link>
        </Button>

        {/* Movie Details */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Poster */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <img
                src={movie.posterUrl || "/placeholder-movie.jpg"}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover"
              />
            </Card>
          </div>

          {/* Info */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genre?.split(",").map((genre) => (
                    <Badge key={genre.trim()} variant="secondary">
                      {genre.trim()}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold">
                      {formatDuration(movie.durationMin)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Release Date
                    </p>
                    <p className="font-semibold">
                      {movie.releaseDate
                        ? format(new Date(movie.releaseDate), "MMMM dd, yyyy")
                        : "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h2 className="text-xl font-semibold mb-3">Synopsis</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {movie.description}
                </p>
              </div>

              <Button size="lg" className="w-full sm:w-auto" asChild>
                <a href="#showtimes">Book Tickets</a>
              </Button>
            </div>
          </div>
        </div>

        {/* Showtimes */}
        <div id="showtimes">
          <Card>
            <CardHeader>
              <CardTitle>Available Showtimes</CardTitle>
            </CardHeader>
            <CardContent>
              {showtimesLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full" />
                  ))}
                </div>
              ) : showtimes.length > 0 ? (
                <div className="space-y-4">
                  {showtimes.map((showtime) => (
                    <ShowtimeCard
                      key={showtime.id}
                      showtime={showtime}
                      onSelect={(selectedShowtime) => {
                        setMovie(movie);
                        setShowtime(selectedShowtime);
                        navigate(`/booking/${selectedShowtime.id}`);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">
                    No Showtimes Available
                  </h3>
                  <p className="text-muted-foreground">
                    Check back later for available showtimes
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
