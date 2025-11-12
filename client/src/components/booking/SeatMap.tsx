import { cn } from "@/lib/utils";
import type { Seat } from "@/types/models";

interface SeatMapProps {
  seats: Seat[];
  selectedSeats: string[];
  onSeatSelect: (seatId: string) => void;
  disabled?: boolean;
}

export default function SeatMap({
  seats,
  selectedSeats,
  onSeatSelect,
  disabled = false,
}: SeatMapProps) {
  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    const row = seat.row;
    if (!acc[row]) {
      acc[row] = [];
    }
    acc[row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  const rows = Object.keys(seatsByRow).sort();

  const getSeatStatus = (seat: Seat) => {
    if (seat.status === "OCCUPIED" || seat.status === "BLOCKED") {
      return "unavailable";
    }
    if (selectedSeats.includes(seat.id)) {
      return "selected";
    }
    return "available";
  };

  const getSeatStyles = (status: string) => {
    const baseStyles =
      "w-8 h-8 md:w-10 md:h-10 rounded-t-lg border-2 transition-all duration-200 flex items-center justify-center text-xs font-semibold";

    switch (status) {
      case "selected":
        return cn(
          baseStyles,
          "bg-primary border-primary text-primary-foreground cursor-pointer hover:scale-110"
        );
      case "unavailable":
        return cn(
          baseStyles,
          "bg-muted border-muted text-muted-foreground cursor-not-allowed opacity-50"
        );
      default:
        return cn(
          baseStyles,
          "bg-background border-border hover:border-primary cursor-pointer hover:scale-110"
        );
    }
  };

  const handleSeatClick = (seat: Seat) => {
    if (disabled) return;
    const status = getSeatStatus(seat);
    if (status === "unavailable") return;
    onSeatSelect(seat.id);
  };

  return (
    <div className="space-y-6">
      {/* Screen */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <div className="w-full max-w-2xl h-2 bg-gradient-to-b from-gray-400 to-gray-200 rounded-b-3xl shadow-lg" />
        <span className="text-sm text-muted-foreground font-medium">
          SCREEN
        </span>
      </div>

      {/* Seat Grid */}
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row} className="flex items-center justify-center gap-2">
            <span className="w-6 text-sm font-semibold text-muted-foreground">
              {row}
            </span>
            <div className="flex gap-2 flex-wrap justify-center">
              {seatsByRow[row]
                .sort((a, b) => a.number - b.number)
                .map((seat) => {
                  const status = getSeatStatus(seat);
                  return (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat)}
                      disabled={status === "unavailable" || disabled}
                      className={getSeatStyles(status)}
                      title={`${seat.row}${seat.number} - ${
                        status === "unavailable"
                          ? "Unavailable"
                          : status === "selected"
                          ? "Selected"
                          : "Available"
                      }`}
                    >
                      {seat.number}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-lg bg-background border-2 border-border" />
          <span className="text-sm">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-lg bg-primary border-2 border-primary" />
          <span className="text-sm">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-t-lg bg-muted border-2 border-muted opacity-50" />
          <span className="text-sm">Unavailable</span>
        </div>
      </div>
    </div>
  );
}
