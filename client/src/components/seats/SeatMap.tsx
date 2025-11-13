import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Seat, { type SeatStatus } from "./Seat";
import SeatLegend from "./SeatLegend";
import { Film } from "lucide-react";

export interface SeatData {
  id: string;
  seatNumber: string;
  rowLabel: string;
  seatType: string;
  isAvailable: boolean;
}

interface SeatMapProps {
  seats: SeatData[];
  selectedSeatIds: string[];
  onSeatSelect: (seatId: string) => void;
  maxSeats?: number;
  disabled?: boolean;
  showLegend?: boolean;
}

export default function SeatMap({
  seats,
  selectedSeatIds,
  onSeatSelect,
  maxSeats = 10,
  disabled = false,
  showLegend = true,
}: SeatMapProps) {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);

  // Group seats by row
  const seatsByRow = useMemo(() => {
    const grouped = seats.reduce((acc, seat) => {
      const row = seat.rowLabel;
      if (!acc[row]) {
        acc[row] = [];
      }
      acc[row].push(seat);
      return acc;
    }, {} as Record<string, SeatData[]>);

    // Sort seats within each row by seat number
    Object.keys(grouped).forEach((row) => {
      grouped[row].sort((a, b) => {
        const numA = parseInt(a.seatNumber.replace(/\D/g, ""), 10);
        const numB = parseInt(b.seatNumber.replace(/\D/g, ""), 10);
        return numA - numB;
      });
    });

    return grouped;
  }, [seats]);

  // Sort rows alphabetically
  const sortedRows = useMemo(() => {
    return Object.keys(seatsByRow).sort();
  }, [seatsByRow]);

  const getSeatStatus = (seat: SeatData): SeatStatus => {
    if (!seat.isAvailable) return "occupied";
    if (selectedSeatIds.includes(seat.id)) return "selected";
    return "available";
  };

  const handleSeatClick = (seat: SeatData) => {
    if (disabled) return;

    const status = getSeatStatus(seat);

    // Can't select occupied seats
    if (status === "occupied") return;

    // If trying to select but max reached
    if (status === "available" && selectedSeatIds.length >= maxSeats) {
      return;
    }

    onSeatSelect(seat.id);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Film className="h-5 w-5" />
            Select Your Seats
          </CardTitle>
          {maxSeats && (
            <p className="text-sm text-muted-foreground">
              You can select up to {maxSeats} seats. Currently selected:{" "}
              {selectedSeatIds.length}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Screen */}
          <div className="flex flex-col items-center gap-2 mb-8">
            <div className="w-full max-w-3xl h-3 bg-gradient-to-b from-primary/50 to-primary/20 rounded-b-[40px] shadow-lg" />
            <span className="text-sm text-muted-foreground font-medium tracking-wider">
              SCREEN
            </span>
          </div>

          {/* Seat Grid */}
          <div className="space-y-3 overflow-x-auto">
            {sortedRows.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No seats available for this showtime
              </div>
            ) : (
              sortedRows.map((row) => (
                <div
                  key={row}
                  className="flex items-center justify-start gap-3 min-w-max"
                >
                  {/* Row Label */}
                  <div className="w-8 flex items-center justify-center">
                    <span className="text-sm font-bold text-muted-foreground">
                      {row}
                    </span>
                  </div>

                  {/* Seats in Row */}
                  <div className="flex gap-2">
                    {seatsByRow[row].map((seat) => {
                      const status = getSeatStatus(seat);
                      return (
                        <div
                          key={seat.id}
                          onMouseEnter={() => setHoveredSeat(seat.id)}
                          onMouseLeave={() => setHoveredSeat(null)}
                        >
                          <Seat
                            seatNumber={seat.seatNumber}
                            status={status}
                            row={seat.rowLabel}
                            onClick={() => handleSeatClick(seat)}
                            disabled={disabled}
                            className={
                              hoveredSeat === seat.id && status === "available"
                                ? "ring-2 ring-primary ring-offset-2"
                                : ""
                            }
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Selected Seats Display */}
          {selectedSeatIds.length > 0 && (
            <div className="mt-6 p-4 bg-primary/5 rounded-lg">
              <h4 className="text-sm font-semibold mb-2">Selected Seats</h4>
              <div className="flex flex-wrap gap-2">
                {selectedSeatIds.map((seatId) => {
                  const seat = seats.find((s) => s.id === seatId);
                  return seat ? (
                    <span
                      key={seatId}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-md text-sm font-medium"
                    >
                      {seat.rowLabel}-{seat.seatNumber}
                    </span>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      {showLegend && <SeatLegend />}
    </div>
  );
}
