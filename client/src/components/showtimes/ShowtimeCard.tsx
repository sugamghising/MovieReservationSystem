import { Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Showtime } from "@/types/models";
import { format } from "date-fns";

interface ShowtimeCardProps {
  showtime: Showtime;
  onSelect: (showtime: Showtime) => void;
  selected?: boolean;
}

export default function ShowtimeCard({
  showtime,
  onSelect,
  selected = false,
}: ShowtimeCardProps) {
  const availableSeats = showtime.availableSeats ?? 0;
  const totalSeats = showtime.totalSeats ?? 0;
  const occupancyRate =
    totalSeats > 0 ? ((totalSeats - availableSeats) / totalSeats) * 100 : 0;

  const getAvailabilityColor = () => {
    if (availableSeats === 0) return "text-red-500";
    if (availableSeats < 10) return "text-orange-500";
    return "text-green-500";
  };

  const getAvailabilityText = () => {
    if (availableSeats === 0) return "Sold Out";
    if (availableSeats < 10) return "Few seats left";
    return `${availableSeats} seats available`;
  };

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        selected ? "ring-2 ring-primary" : ""
      }`}
      onClick={() => availableSeats > 0 && onSelect(showtime)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-semibold">
                {format(new Date(showtime.startTime), "h:mm a")}
              </span>
              {showtime.endTime && (
                <span className="text-sm text-muted-foreground">
                  - {format(new Date(showtime.endTime), "h:mm a")}
                </span>
              )}
            </div>

            {showtime.theater && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{showtime.theater.name}</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium ${getAvailabilityColor()}`}>
                {getAvailabilityText()}
              </span>
              {occupancyRate > 70 && (
                <Badge variant="secondary" className="text-xs">
                  Filling Fast
                </Badge>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <p className="text-2xl font-bold">${showtime.price}</p>
              <p className="text-xs text-muted-foreground">per seat</p>
            </div>

            <Button
              size="sm"
              disabled={availableSeats === 0}
              className="min-w-[80px]"
            >
              {availableSeats === 0
                ? "Sold Out"
                : selected
                ? "Selected"
                : "Select"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
