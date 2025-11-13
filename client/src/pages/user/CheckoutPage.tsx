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
    reservationId,
    nextStep,
    previousStep,
  } = useBookingStore();

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const createPaymentIntent = useCreatePaymentIntent();
  const confirmPayment = useConfirmPayment();

  useEffect(() => {
    // Redirect if no booking data or reservation
    if (!movie || !showtime || selectedSeats.length === 0 || !reservationId) {
      navigate("/movies");
    }
  }, [movie, showtime, selectedSeats, reservationId, navigate]);

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

    if (!reservationId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No reservation found. Please go back and select seats.",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create payment intent
      const paymentIntentResponse = await createPaymentIntent.mutateAsync({
        reservationId,
      });

      // Step 2: Simulate card processing (in production, use Stripe Elements)
      // Wait a bit to simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Step 3: Confirm payment
      await confirmPayment.mutateAsync(paymentIntentResponse.paymentId);

      // Success!
      nextStep();
      toast({
        title: "Payment Successful!",
        description: "Your booking has been confirmed.",
      });

      navigate("/payment-success");
    } catch (error) {
      console.error("Payment error:", error);
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
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 py-8">
      <div className="container max-w-7xl">
        {/* Enhanced Header */}
        <div className="mb-8 space-y-4">
          <Button
            variant="ghost"
            onClick={() => {
              previousStep();
              navigate("/booking");
            }}
            className="group hover:bg-primary/10 transition-all"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Seat Selection
          </Button>

          {/* Payment Header Banner */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-rose-600 to-purple-600 p-6 text-white shadow-2xl">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-wider opacity-90">
                  Secure Checkout
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Complete Your Booking
              </h1>
              <p className="text-sm md:text-base opacity-90">
                Your reservation is secured • Final step to confirm
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <Card className="mb-8 border-0 shadow-lg bg-card/50 backdrop-blur">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between">
                {steps.map((step, index) => (
                  <div
                    key={step.number}
                    className="flex flex-col items-center relative"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 font-semibold transition-all duration-300 ${
                        step.number < currentStep
                          ? "bg-green-500 text-white shadow-lg shadow-green-500/50"
                          : step.number === currentStep
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/50 scale-110"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step.number < currentStep ? "✓" : step.number}
                    </div>
                    <span
                      className={`text-xs text-center hidden sm:block font-medium ${
                        step.number <= currentStep
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.name}
                    </span>
                    {index < steps.length - 1 && (
                      <div
                        className={`absolute top-5 left-1/2 w-full h-0.5 -z-10 transition-all duration-300 ${
                          step.number < currentStep
                            ? "bg-green-500"
                            : "bg-muted"
                        }`}
                        style={{ transform: "translateY(-50%)" }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <Progress value={progress} className="h-2.5 shadow-inner" />
            </div>
          </CardContent>
        </Card>

        {/* Main Content - Enhanced */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form - Enhanced */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CreditCard className="h-6 w-6 text-primary" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Enhanced Security Notice */}
                <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <Lock className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                      Secure Payment
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-500">
                      Your payment information is encrypted and protected
                    </p>
                  </div>
                </div>

                {/* Card Number */}
                <div className="space-y-2">
                  <Label
                    htmlFor="cardNumber"
                    className="text-base font-semibold"
                  >
                    Card Number
                  </Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(formatCardNumber(e.target.value))
                    }
                    maxLength={19}
                    className="h-12 text-base"
                  />
                </div>

                {/* Cardholder Name */}
                <div className="space-y-2">
                  <Label htmlFor="cardName" className="text-base font-semibold">
                    Cardholder Name
                  </Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>

                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="expiryDate"
                      className="text-base font-semibold"
                    >
                      Expiry Date
                    </Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) =>
                        setExpiryDate(formatExpiryDate(e.target.value))
                      }
                      maxLength={5}
                      className="h-12 text-base"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv" className="text-base font-semibold">
                      CVV
                    </Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={cvv}
                      onChange={(e) =>
                        setCvv(e.target.value.replace(/\D/g, ""))
                      }
                      maxLength={4}
                      type="password"
                      className="h-12 text-base"
                    />
                  </div>
                </div>

                <Separator />

                {/* Enhanced Action Buttons */}
                <div className="space-y-3 pt-4">
                  <Button
                    size="lg"
                    className="w-full h-14 text-base font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700"
                    onClick={handlePayment}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <Skeleton className="h-5 w-5 mr-2 rounded-full" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock className="h-5 w-5 mr-2" />
                        Pay ${totalPrice.toFixed(2)}
                      </>
                    )}
                  </Button>

                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full h-12 hover:bg-muted transition-all"
                    onClick={() => {
                      previousStep();
                      navigate("/booking");
                    }}
                    disabled={isProcessing}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Seats
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-4">
              <BookingSummary
                showtime={showtime}
                selectedSeats={selectedSeats}
                totalPrice={totalPrice}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
