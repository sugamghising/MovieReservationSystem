import { useState } from "react";
import { Film } from "lucide-react";
import MovieCard from "@/components/movies/MovieCard";
import MovieFilters, {
  type MovieFilters as MovieFiltersType,
} from "@/components/movies/MovieFilters";
import { useMovies } from "@/hooks/useMovies";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent } from "@/components/ui/card";
import EmptyState from "@/components/common/EmptyState";

export default function MoviesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<MovieFiltersType>({
    sortBy: "releaseDate",
    sortOrder: "desc",
  });

  const { data, isLoading } = useMovies({
    page: currentPage,
    limit: 12,
    search: filters.search,
    genre: filters.genre,
  });

  const movies = data?.data || [];
  const meta = data?.meta;

  const handleFilterChange = (newFilters: MovieFiltersType) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      sortBy: "releaseDate",
      sortOrder: "desc",
    });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container ml-8 md:ml-12 lg:ml-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Browse Movies</h1>
          <p className="text-lg text-muted-foreground">
            Discover the latest releases and timeless classics
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <MovieFilters
            filters={filters}
            onFiltersChange={handleFilterChange}
          />
        </div>

        {/* Results Count */}
        {meta && (
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {movies.length} of {meta.totalItems} movies
          </div>
        )}

        {/* Movies Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="aspect-[2/3] bg-muted animate-pulse" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded mb-2 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-2/3 animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
            {meta && meta.totalPages > 1 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        className={
                          !meta.hasPreviousPage
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {[...Array(Math.min(5, meta.totalPages))].map((_, i) => {
                      const pageNumber = i + 1;
                      return (
                        <PaginationItem key={pageNumber}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNumber)}
                            isActive={currentPage === pageNumber}
                            className="cursor-pointer"
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(meta.totalPages, prev + 1)
                          )
                        }
                        className={
                          !meta.hasNextPage
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={Film}
            title="No movies found"
            description="Try adjusting your search or filters"
            action={{
              label: "Clear Filters",
              onClick: handleClearFilters,
            }}
          />
        )}
      </div>
    </div>
  );
}
