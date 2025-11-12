import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ShowtimeCard from "@/components/showtimes/ShowtimeCard";
import { useShowtimes } from "@/hooks/useShowtimes";
import { useNavigate } from "react-router-dom";
import { useBookingStore } from "@/store";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/common/EmptyState";
import type { Showtime } from "@/types/models";

export default function ShowtimesPage() {
  const navigate = useNavigate();
  const { setMovie, setShowtime } = useBookingStore();

  const { data, isLoading } = useShowtimes({
    page: 1,
    limit: 50,
  });

  const showtimes = data?.data || [];

  const handleShowtimeSelect = (showtime: Showtime) => {
    if (showtime.movie) {
      setMovie(showtime.movie);
    }
    setShowtime(showtime);
    navigate("/booking");
  };

  // Group showtimes by movie
  const showtimesByMovie = showtimes.reduce((acc, showtime) => {
    const movieId = showtime.movieId;
    if (!acc[movieId]) {
      acc[movieId] = [];
    }
    acc[movieId].push(showtime);
    return acc;
  }, {} as Record<string, typeof showtimes>);

  return (
    <div className="min-h-screen py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Movie Showtimes</h1>
          <p className="text-lg text-muted-foreground">
            Find and book showtimes for all movies
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-64" />
                </CardHeader>
                <CardContent className="space-y-4">
                  {[...Array(3)].map((_, j) => (
                    <Skeleton key={j} className="h-24 w-full" />
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : Object.keys(showtimesByMovie).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(showtimesByMovie).map(
              ([movieId, movieShowtimes]) => {
                const movie = movieShowtimes[0]?.movie;
                if (!movie) return null;

                return (
                  <Card key={movieId}>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        {movie.posterUrl && (
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="w-16 h-24 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-2">
                            {movie.title}
                          </CardTitle>
                          {movie.genre && (
                            <p className="text-sm text-muted-foreground">
                              {movie.genre}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {movieShowtimes.map((showtime) => (
                          <ShowtimeCard
                            key={showtime.id}
                            showtime={showtime}
                            onSelect={handleShowtimeSelect}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              }
            )}
          </div>
        ) : (
          <EmptyState
            icon={Calendar}
            title="No showtimes available"
            description="Check back later for upcoming showtimes"
          />
        )}
      </div>
    </div>
  );
}
