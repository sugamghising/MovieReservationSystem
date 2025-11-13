import { XCircle, RotateCcw, Home, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentFailedProps {
  errorMessage?: string;
  reservationId?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  onContactSupport?: () => void;
}

export default function PaymentFailed({
  errorMessage = "Payment could not be processed",
  reservationId,
  onRetry,
  onGoHome,
  onContactSupport,
}: PaymentFailedProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
            <p className="text-muted-foreground">
              We couldn't process your payment
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Message */}
          <Alert variant="destructive">
            <AlertDescription className="text-sm">
              <strong>Error:</strong> {errorMessage}
            </AlertDescription>
          </Alert>

          {/* Reservation ID if available */}
          {reservationId && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Reservation ID
                </span>
                <span className="font-mono text-sm">{reservationId}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Your reservation is still held. Please complete payment within
                15 minutes.
              </p>
            </div>
          )}

          {/* Common Issues */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Common Issues
            </h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Insufficient funds in your account</li>
              <li>• Incorrect card details or expired card</li>
              <li>• Card declined by your bank</li>
              <li>• Network connection issues</li>
              <li>• Your bank may require authentication</li>
            </ul>
            <p className="text-xs text-muted-foreground pt-2">
              If the problem persists, please contact your bank or try a
              different payment method.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-4">
            {onRetry && (
              <Button onClick={onRetry} className="w-full" size="lg">
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
            <div className="grid grid-cols-2 gap-3">
              {onContactSupport && (
                <Button
                  variant="outline"
                  onClick={onContactSupport}
                  className="w-full"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Contact Support
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
