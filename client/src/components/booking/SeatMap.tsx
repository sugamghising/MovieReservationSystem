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
    const row = seat.row || "Unknown";
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
      "w-9 h-9 md:w-11 md:h-11 rounded-t-xl border-2 transition-all duration-200 flex items-center justify-center text-xs font-bold shadow-md relative";

    switch (status) {
      case "selected":
        return cn(
          baseStyles,
          "bg-gradient-to-b from-rose-500 to-rose-600 border-rose-600 text-white cursor-pointer hover:scale-110 shadow-lg shadow-rose-500/50 animate-in zoom-in-50"
        );
      case "unavailable":
        return cn(
          baseStyles,
          "bg-muted border-muted text-muted-foreground cursor-not-allowed opacity-40"
        );
      default:
        return cn(
          baseStyles,
          "bg-gradient-to-b from-background to-muted/30 border-border hover:border-primary cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-primary/30"
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
    <div className="space-y-8">
      {/* Enhanced Screen */}
      <div className="flex flex-col items-center gap-3 mb-10">
        <div className="relative w-full max-w-3xl">
          <div className="h-3 bg-gradient-to-b from-gray-400 via-gray-300 to-gray-200 rounded-b-[3rem] shadow-2xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-b-[3rem]" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-px w-8 bg-gradient-to-r from-transparent to-muted-foreground" />
          <span className="text-sm text-muted-foreground font-semibold tracking-widest uppercase">
            Screen
          </span>
          <div className="h-px w-8 bg-gradient-to-l from-transparent to-muted-foreground" />
        </div>
      </div>

      {/* Enhanced Seat Grid */}
      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row} className="flex items-center justify-center gap-3">
            <span className="w-8 text-center text-sm font-bold text-muted-foreground bg-muted/30 rounded px-2 py-1">
              {row}
            </span>
            <div className="flex gap-2 flex-wrap justify-center">
              {seatsByRow[row]
                .sort((a, b) => (a.number || 0) - (b.number || 0))
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
                      <span className="text-[10px] font-bold">
                        {seat.number || seat.label.slice(-1)}
                      </span>
                    </button>
                  );
                })}
            </div>
            <span className="w-8 text-center text-sm font-bold text-muted-foreground bg-muted/30 rounded px-2 py-1">
              {row}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
