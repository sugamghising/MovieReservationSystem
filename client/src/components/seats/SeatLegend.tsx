import { Card, CardContent } from "@/components/ui/card";

interface SeatLegendItem {
  label: string;
  color: string;
  borderColor: string;
}

export default function SeatLegend() {
  const legendItems: SeatLegendItem[] = [
    {
      label: "Available",
      color: "bg-secondary/30",
      borderColor: "border-border",
    },
    {
      label: "Selected",
      color: "bg-primary",
      borderColor: "border-primary",
    },
    {
      label: "Occupied",
      color: "bg-muted/50",
      borderColor: "border-muted",
    },
  ];

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-center justify-center gap-6">
          {legendItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-t-xl border-2 ${item.color} ${item.borderColor}`}
              />
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
