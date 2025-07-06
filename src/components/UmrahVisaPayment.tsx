
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PayUCheckout from "./PayUCheckout";
import { FileText, CreditCard, Clock, Shield } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface UmrahVisaPaymentProps {
  visaType: string;
  amount: number;
  processingTime: string;
  visaApplicationId?: string;
  onPaymentSuccess?: () => void;
  onProceedToPayment?: () => Promise<string | null>; // Returns visa application ID
}

const UmrahVisaPayment: React.FC<UmrahVisaPaymentProps> = ({
  visaType,
  amount,
  processingTime,
  visaApplicationId,
  onPaymentSuccess,
  onProceedToPayment,
}) => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentVisaApplicationId, setCurrentVisaApplicationId] = useState<string | null>(
    visaApplicationId || null
  );

  const productInfo = `Umrah Visa Processing - ${visaType}`;

  const handleProceedToPayment = async () => {
    setIsLoading(true);
    setPaymentError(null);
    try {
      let applicationId = currentVisaApplicationId;
      
      if (onProceedToPayment) {
        applicationId = await onProceedToPayment();
        if (applicationId) {
          setCurrentVisaApplicationId(applicationId);
        }
      }
      
      if (!applicationId) {
        throw new Error("Failed to create visa application. Please try again.");
      }
      
      setShowCheckout(true);
    } catch (e) {
      setPaymentError(
        e instanceof Error ? e.message : "Failed to save application. Please check your details and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowCheckout(false);
    toast({
      title: "Payment Successful",
      description: "Your visa application payment has been completed successfully.",
    });
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    });
  };

  if (showCheckout && currentVisaApplicationId) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => setShowCheckout(false)}
          className="mb-4"
        >
          ← Back to Visa Details
        </Button>

        <PayUCheckout
          visaApplicationId={currentVisaApplicationId}
          amount={amount}
          productInfo={productInfo}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-600" />
          Visa Payment Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Visa Type:</span>
            <Badge variant="outline">{visaType}</Badge>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Processing Time:</span>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm">{processingTime}</span>
            </div>
          </div>

          <div className="border-t pt-3">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Total Amount:</span>
              <span className="text-emerald-600">
                ₹{amount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-sm text-blue-700 mb-2">
            <Shield className="w-4 h-4" />
            <span className="font-medium">What's Included</span>
          </div>
          <ul className="text-xs text-blue-600 space-y-1">
            <li>• Visa processing and documentation</li>
            <li>• Expert review of application</li>
            <li>• Status updates and tracking</li>
            <li>• Customer support throughout process</li>
          </ul>
        </div>

        <Button
          onClick={handleProceedToPayment}
          disabled={isLoading}
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          size="lg"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          {isLoading ? "Processing..." : "Proceed to Payment"}
        </Button>

        {paymentError && (
          <p className="text-xs text-red-500 text-center">{paymentError}</p>
        )}

        <p className="text-xs text-gray-500 text-center">
          Secure payment processing powered by PayU. Your payment information is
          encrypted and protected.
        </p>
      </CardContent>
    </Card>
  );
};

export default UmrahVisaPayment;
