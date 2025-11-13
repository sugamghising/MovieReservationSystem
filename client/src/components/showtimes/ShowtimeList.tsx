import { Loader2, Clock } from "lucide-react";
import ShowtimeCard from "./ShowtimeCard";
import EmptyState from "@/components/common/EmptyState";
import type { Showtime } from "@/types/models";

interface ShowtimeListProps {
  showtimes: Showtime[];
  isLoading?: boolean;
  onShowtimeSelect?: (showtimeId: string) => void;
}

export default function ShowtimeList({
  showtimes,
  isLoading,
  onShowtimeSelect,
}: ShowtimeListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (showtimes.length === 0) {
    return (
      <EmptyState
        icon={Clock}
        title="No Showtimes Available"
        description="There are no showtimes available for the selected date. Please try a different date."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {showtimes.map((showtime) => (
        <ShowtimeCard
          key={showtime.id}
          showtime={showtime}
          onSelect={() => onShowtimeSelect && onShowtimeSelect(showtime.id)}
        />
      ))}
    </div>
  );
}
