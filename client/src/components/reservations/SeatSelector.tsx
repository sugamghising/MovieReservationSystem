import { useState, useEffect } from "react";
import { Armchair, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Seat } from "@/types/models";

interface SeatSelectorProps {
  seats: Seat[];
  selectedSeatIds: number[];
  onSeatSelect: (seatIds: number[]) => void;
  maxSeats?: number;
  isLoading?: boolean;
  availableSeats?: number[];
  price: number;
}

export default function SeatSelector({
  seats,
  selectedSeatIds,
  onSeatSelect,
  maxSeats = 10,
  isLoading,
  availableSeats = [],
  price,
}: SeatSelectorProps) {
  const [selectedSeats, setSelectedSeats] = useState<number[]>(selectedSeatIds);

  useEffect(() => {
    setSelectedSeats(selectedSeatIds);
  }, [selectedSeatIds]);

  // Group seats by row
  const seatsByRow = seats.reduce((acc, seat) => {
    const row = seat.rowLabel;
    if (!acc[row]) {
      acc[row] = [];
    }
    acc[row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  // Sort rows alphabetically
  const sortedRows = Object.keys(seatsByRow).sort();

  const handleSeatClick = (seatId: number) => {
    if (!availableSeats.includes(seatId)) return;

    let newSelectedSeats: number[];

    if (selectedSeats.includes(seatId)) {
      newSelectedSeats = selectedSeats.filter((id) => id !== seatId);
    } else {
      if (selectedSeats.length >= maxSeats) {
        return; // Max seats reached
      }
      newSelectedSeats = [...selectedSeats, seatId];
    }

    setSelectedSeats(newSelectedSeats);
    onSeatSelect(newSelectedSeats);
  };

  const getSeatStatus = (seat: Seat) => {
    const seatId = parseInt(seat.id);
    if (selectedSeats.includes(seatId)) return "selected";
    if (availableSeats.includes(seatId)) return "available";
    return "booked";
  };

  const getSeatColor = (status: string) => {
    switch (status) {
      case "selected":
        return "bg-primary text-primary-foreground hover:bg-primary/90";
      case "available":
        return "bg-secondary hover:bg-secondary/80 cursor-pointer";
      case "booked":
        return "bg-muted text-muted-foreground cursor-not-allowed opacity-50";
      default:
        return "bg-secondary";
    }
  };

  const totalPrice = selectedSeats.length * price;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Armchair className="h-5 w-5" />
          Select Your Seats
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-secondary rounded" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-primary rounded" />
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-muted rounded opacity-50" />
            <span>Booked</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Screen */}
        <div className="mb-8">
          <div className="h-2 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mb-2" />
          <p className="text-center text-sm text-muted-foreground">SCREEN</p>
        </div>

        {/* Seats Grid */}
        <div className="space-y-3">
          {sortedRows.map((row) => (
            <div key={row} className="flex items-center gap-2">
              <div className="w-8 text-center font-semibold text-sm">{row}</div>
              <div className="flex flex-wrap gap-2 flex-1 justify-center">
                {seatsByRow[row]
                  .sort((a, b) => a.seatNumber.localeCompare(b.seatNumber))
                  .map((seat) => {
                    const status = getSeatStatus(seat);
                    const seatId = parseInt(seat.id);
                    return (
                      <button
                        key={seat.id}
                        onClick={() => handleSeatClick(seatId)}
                        disabled={status === "booked"}
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center text-xs font-medium transition-all",
                          getSeatColor(status),
                          status === "selected" &&
                            "ring-2 ring-primary ring-offset-2"
                        )}
                        title={`Row ${seat.rowLabel}, Seat ${seat.seatNumber} - ${seat.seatType}`}
                      >
                        {status === "selected" ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          seat.seatNumber.split("-")[1] || seat.seatNumber
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* Selection Info */}
        {selectedSeats.length > 0 && (
          <div className="mt-6 p-4 bg-primary/5 rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Selected Seats</span>
              <Badge variant="secondary">
                {selectedSeats.length} / {maxSeats}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedSeats.map((seatId) => {
                const seat = seats.find((s) => parseInt(s.id) === seatId);
                return seat ? (
                  <span
                    key={seatId}
                    className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium"
                  >
                    {seat.rowLabel}-{seat.seatNumber}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}
      </CardContent>

      {/* Footer with Price and Action */}
      <CardFooter className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Total Price</p>
          <p className="text-2xl font-bold">${totalPrice.toFixed(2)}</p>
        </div>
        <Button
          disabled={selectedSeats.length === 0}
          size="lg"
          className="min-w-[120px]"
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
