import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format, addDays, isSameDay, startOfToday } from "date-fns";

interface DateSelectorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  daysToShow?: number;
}

export default function DateSelector({
  selectedDate,
  onDateSelect,
  daysToShow = 7,
}: DateSelectorProps) {
  const [startIndex, setStartIndex] = useState(0);
  const today = startOfToday();

  // Generate dates array
  const dates = Array.from({ length: 30 }, (_, i) => addDays(today, i));
  const visibleDates = dates.slice(startIndex, startIndex + daysToShow);

  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex(Math.max(0, startIndex - 1));
    }
  };

  const handleNext = () => {
    if (startIndex + daysToShow < dates.length) {
      setStartIndex(startIndex + 1);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevious}
        disabled={startIndex === 0}
        className="shrink-0"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex gap-2 overflow-hidden">
        {visibleDates.map((date) => {
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, today);

          return (
            <Button
              key={date.toISOString()}
              variant={isSelected ? "default" : "outline"}
              onClick={() => onDateSelect(date)}
              className={cn(
                "flex flex-col items-center min-w-[80px] h-auto py-3 relative",
                isToday && !isSelected && "border-primary"
              )}
            >
              {isToday && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                </span>
              )}
              <span className="text-xs font-medium">{format(date, "EEE")}</span>
              <span className="text-2xl font-bold">{format(date, "dd")}</span>
              <span className="text-xs">{format(date, "MMM")}</span>
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={handleNext}
        disabled={startIndex + daysToShow >= dates.length}
        className="shrink-0"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
