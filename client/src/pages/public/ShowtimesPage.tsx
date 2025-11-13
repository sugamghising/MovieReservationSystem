import { useState } from "react";
import { Calendar, Clock, Film, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DateSelector from "@/components/showtimes/DateSelector";
import ShowtimeCard from "@/components/showtimes/ShowtimeCard";
import { useShowtimes } from "@/hooks/useShowtimes";
import { useNavigate } from "react-router-dom";
import { useBookingStore } from "@/store";
import EmptyState from "@/components/common/EmptyState";
import { startOfToday, format } from "date-fns";
import type { Showtime } from "@/types/models";

export default function ShowtimesPage() {
  const [selectedDate, setSelectedDate] = useState(startOfToday());
  const navigate = useNavigate();
  const { setMovie, setShowtime } = useBookingStore();

  // Format date for API (YYYY-MM-DD)
  const formattedDate = format(selectedDate, "yyyy-MM-dd");

  const { data, isLoading } = useShowtimes({
    date: formattedDate,
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
          <h1 className="text-4xl font-bold mb-2">Browse Showtimes</h1>
          <p className="text-muted-foreground">
            Select a date to view available showtimes for all movies
          </p>
        </div>

        {/* Date Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DateSelector
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              daysToShow={7}
            />
          </CardContent>
        </Card>

        {/* Selected Date Display */}
        <div className="flex items-center gap-2 mb-6 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            Showing showtimes for{" "}
            <strong>{format(selectedDate, "EEEE, MMMM dd, yyyy")}</strong>
          </span>
        </div>

        {/* Showtimes List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                      <div className="flex flex-col md:flex-row gap-4">
                        {/* Movie Poster */}
                        {movie.posterUrl && (
                          <img
                            src={movie.posterUrl}
                            alt={movie.title}
                            className="w-24 h-36 object-cover rounded-md"
                          />
                        )}

                        {/* Movie Info */}
                        <div className="flex-1">
                          <CardTitle className="text-2xl mb-2">
                            {movie.title}
                          </CardTitle>
                          {movie.genre && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {movie.genre}
                            </p>
                          )}
                          {movie.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                              {movie.description}
                            </p>
                          )}
                          <Button
                            variant="link"
                            className="px-0"
                            onClick={() => navigate(`/movies/${movie.id}`)}
                          >
                            View Movie Details →
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        <h3 className="font-semibold text-sm text-muted-foreground">
                          Available Showtimes ({movieShowtimes.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {movieShowtimes.map((showtime) => (
                            <ShowtimeCard
                              key={showtime.id}
                              showtime={showtime}
                              onSelect={() => handleShowtimeSelect(showtime)}
                            />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              }
            )}
          </div>
        ) : (
          <EmptyState
            icon={Film}
            title="No Showtimes Available"
            description="There are no showtimes available for the selected date. Please try a different date."
            action={{
              label: "View All Movies",
              onClick: () => navigate("/movies"),
            }}
          />
        )}
      </div>
    </div>
  );
}
