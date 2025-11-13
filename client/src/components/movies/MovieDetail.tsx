import { Calendar, Clock, Star, Play } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Movie } from "@/types/models";

interface MovieDetailProps {
  movie: Movie;
  onBookNow?: () => void;
}

export default function MovieDetail({ movie, onBookNow }: MovieDetailProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Play className="h-24 w-24 text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Movie Info */}
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="text-sm">
                {movie.genre}
              </Badge>
              {movie.durationMin && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {formatDuration(movie.durationMin)}
                </span>
              )}
              {movie.releaseDate && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {new Date(movie.releaseDate).getFullYear()}
                </span>
              )}
            </div>
          </div>
          {onBookNow && (
            <Button size="lg" onClick={onBookNow}>
              Book Now
            </Button>
          )}
        </div>

        <Separator />

        {/* Description */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-3">Synopsis</h2>
            <p className="text-muted-foreground leading-relaxed">
              {movie.description}
            </p>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
              <h3 className="font-semibold mb-1">Rating</h3>
              <p className="text-2xl font-bold">8.5</p>
              <p className="text-sm text-muted-foreground">IMDb</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-semibold mb-1">Duration</h3>
              <p className="text-2xl font-bold">
                {movie.durationMin ? formatDuration(movie.durationMin) : "N/A"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-secondary" />
              <h3 className="font-semibold mb-1">Release Year</h3>
              <p className="text-2xl font-bold">
                {movie.releaseDate
                  ? new Date(movie.releaseDate).getFullYear()
                  : "N/A"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
