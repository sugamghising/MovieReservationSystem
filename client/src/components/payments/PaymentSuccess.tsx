import { CheckCircle, Download, Home, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PaymentSuccessProps {
  reservationId: string;
  amount: number;
  transactionId?: string;
  onViewReservation?: () => void;
  onGoHome?: () => void;
  onDownloadReceipt?: () => void;
}

export default function PaymentSuccess({
  reservationId,
  amount,
  transactionId,
  onViewReservation,
  onGoHome,
  onDownloadReceipt,
}: PaymentSuccessProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-muted-foreground">
              Your booking has been confirmed and payment processed successfully
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Payment Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Reservation ID
              </span>
              <span className="font-mono text-sm">{reservationId}</span>
            </div>

            <Separator />

            {transactionId && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Transaction ID
                  </span>
                  <span className="font-mono text-sm">{transactionId}</span>
                </div>
                <Separator />
              </>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Amount Paid</span>
              <span className="text-2xl font-bold text-green-600">
                ${amount.toFixed(2)}
              </span>
            </div>
          </div>

          <Separator />

          {/* Information Box */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              What's Next?
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                • A confirmation email has been sent to your registered email
              </li>
              <li>• You can view your ticket details in your reservations</li>
              <li>• Please arrive at the theater 15 minutes before showtime</li>
              <li>• Show your booking ID at the counter to collect tickets</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            {onDownloadReceipt && (
              <Button
                variant="outline"
                onClick={onDownloadReceipt}
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
            )}
            <div className="grid grid-cols-2 gap-3">
              {onViewReservation && (
                <Button onClick={onViewReservation} className="w-full">
                  <Receipt className="h-4 w-4 mr-2" />
                  View Reservation
                </Button>
              )}
              {onGoHome && (
                <Button
                  variant="secondary"
                  onClick={onGoHome}
                  className="w-full"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
