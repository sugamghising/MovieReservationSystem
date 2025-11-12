import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import BookingSummary from "@/components/booking/BookingSummary";
import { useBookingStore } from "@/store";
import { useCreateReservation } from "@/hooks/useReservations";
import { useCreatePaymentIntent, useConfirmPayment } from "@/hooks/usePayment";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    movie,
    showtime,
    selectedSeats,
    totalPrice,
    currentStep,
    nextStep,
    previousStep,
    setReservationId,
  } = useBookingStore();

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const createReservation = useCreateReservation();
  const createPaymentIntent = useCreatePaymentIntent();
  const confirmPayment = useConfirmPayment();

  useEffect(() => {
    // Redirect if no booking data
    if (!movie || !showtime || selectedSeats.length === 0) {
      navigate("/movies");
    }
  }, [movie, showtime, selectedSeats, navigate]);

  if (!movie || !showtime) {
    return null;
  }

  const handlePayment = async () => {
    if (!cardNumber || !cardName || !expiryDate || !cvv) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all payment details",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create reservation
      const reservationResponse = await createReservation.mutateAsync({
        showtimeId: showtime.id,
        seatIds: selectedSeats.map((s) => parseInt(s.id)),
      });

      const reservationId = reservationResponse.reservation.id;
      setReservationId(reservationId);

      // Step 2: Create payment intent
      const paymentIntentResponse = await createPaymentIntent.mutateAsync({
        reservationId,
      });

      // Step 3: Confirm payment (using paymentId returned from payment intent)
      await confirmPayment.mutateAsync(paymentIntentResponse.paymentId);

      // Success!
      nextStep();
      toast({
        title: "Payment Successful!",
        description: "Your booking has been confirmed.",
      });

      navigate("/payment-success");
    } catch {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.slice(0, 2) + "/" + v.slice(2, 4);
    }
    return v;
  };

  const steps = [
    { number: 1, name: "Select Movie", complete: true },
    { number: 2, name: "Select Showtime", complete: true },
    { number: 3, name: "Select Seats", complete: true },
    { number: 4, name: "Payment", complete: false },
    { number: 5, name: "Confirmation", complete: false },
  ];

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => {
              previousStep();
              navigate("/booking");
            }}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Seat Selection
          </Button>
          <h1 className="text-4xl font-bold mb-2">Payment</h1>
          <p className="text-lg text-muted-foreground">
            Complete your booking with secure payment
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className={`flex flex-col items-center ${
                      step.number <= currentStep
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                        step.number <= currentStep
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {step.number}
                    </div>
                    <span className="text-xs text-center hidden sm:block">
                      {step.name}
                    </span>
                  </div>
                ))}
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Security Notice */}
                <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Your payment information is secure and encrypted
                  </p>
                </div>

                {/* Card Number */}
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(formatCardNumber(e.target.value))
                    }
                    maxLength={19}
                  />
                </div>

                {/* Cardholder Name */}
                <div className="space-y-2">
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) =>
                        setExpiryDate(formatExpiryDate(e.target.value))
                      }
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value.replace(/\D/g, ""))
                      }
                      maxLength={4}
                      type="password"
                    />
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full"
                    onClick={handlePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Skeleton className="h-4 w-4 mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>Pay ${totalPrice.toFixed(2)}</>
                    )}
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      previousStep();
                      navigate("/booking");
                    }}
                    disabled={isProcessing}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <BookingSummary
              showtime={showtime}
              selectedSeats={selectedSeats}
              totalPrice={totalPrice}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
