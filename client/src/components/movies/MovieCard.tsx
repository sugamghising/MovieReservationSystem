import { Link } from "react-router-dom";
import { Clock, Calendar, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Movie } from "@/types/models";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const formatDuration = (minutes: number | string | undefined) => {
    // Convert to number and handle invalid values
    const numMinutes =
      typeof minutes === "string" ? parseInt(minutes, 10) : minutes;
    if (numMinutes == null || isNaN(numMinutes)) {
      return "N/A";
    }
    const hours = Math.floor(numMinutes / 60);
    const mins = numMinutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="relative aspect-[2/3] overflow-hidden">
        <img
          src={movie.posterUrl || "/placeholder-movie.jpg"}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {movie.rating && (
          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-white">
              {movie.rating}
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="text-lg font-bold line-clamp-1 mb-2">{movie.title}</h3>

        <div className="flex flex-wrap gap-2 mb-3">
          {movie.genre?.split(",").map((genre) => (
            <Badge key={genre.trim()} variant="secondary" className="text-xs">
              {genre.trim()}
            </Badge>
          ))}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {movie.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(movie.durationMin)}</span>
          </div>
          {movie.releaseDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(movie.releaseDate).getFullYear()}</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link to={`/movies/${movie.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
