import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

export type SeatStatus = "available" | "selected" | "occupied" | "blocked";

interface SeatProps {
  seatNumber: string;
  status: SeatStatus;
  row: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function Seat({
  seatNumber,
  status,
  row,
  onClick,
  disabled = false,
  className,
}: SeatProps) {
  const isClickable =
    !disabled && (status === "available" || status === "selected");

  const getSeatStyles = () => {
    const baseStyles =
      "relative w-10 h-10 md:w-12 md:h-12 rounded-t-xl border-2 transition-all duration-200 flex items-center justify-center text-xs font-semibold";

    switch (status) {
      case "selected":
        return cn(
          baseStyles,
          "bg-primary border-primary text-primary-foreground shadow-lg scale-110",
          isClickable && "cursor-pointer hover:scale-115"
        );
      case "occupied":
        return cn(
          baseStyles,
          "bg-muted/50 border-muted text-muted-foreground cursor-not-allowed opacity-40"
        );
      case "blocked":
        return cn(
          baseStyles,
          "bg-destructive/10 border-destructive/30 text-destructive cursor-not-allowed opacity-40"
        );
      default: // available
        return cn(
          baseStyles,
          "bg-secondary/30 border-border hover:border-primary cursor-pointer hover:scale-110 hover:shadow-md"
        );
    }
  };

  const handleClick = () => {
    if (isClickable && onClick) {
      onClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || !isClickable}
      className={cn(getSeatStyles(), className)}
      title={`Row ${row}, Seat ${seatNumber} - ${
        status.charAt(0).toUpperCase() + status.slice(1)
      }`}
      aria-label={`Seat ${row}${seatNumber}`}
      aria-pressed={status === "selected"}
      aria-disabled={status === "occupied" || status === "blocked"}
    >
      {status === "selected" ? (
        <CheckCircle2 className="h-5 w-5" />
      ) : (
        <span>{seatNumber}</span>
      )}
    </button>
  );
}
