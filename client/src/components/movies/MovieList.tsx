import { Loader2, Film } from "lucide-react";
import MovieCard from "./MovieCard";
import EmptyState from "@/components/common/EmptyState";
import type { Movie } from "@/types/models";

interface MovieListProps {
  movies: Movie[];
  isLoading?: boolean;
  onMovieClick?: (movieId: string) => void;
}

export default function MovieList({
  movies,
  isLoading,
  onMovieClick,
}: MovieListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <EmptyState
        icon={Film}
        title="No Movies Found"
        description="There are no movies available at the moment. Please check back later."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <div
          key={movie.id}
          onClick={() => onMovieClick && onMovieClick(movie.id)}
          className="cursor-pointer"
        >
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );
}
