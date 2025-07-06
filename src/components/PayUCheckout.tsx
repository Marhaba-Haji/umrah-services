import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { initiatePayment, redirectToPayU } from "@/services/paymentService";
import { Loader2, CreditCard, Shield, Check } from "lucide-react";

interface PayUCheckoutProps {
  bookingId: string;
  amount: number;
  productInfo: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
}

const PayUCheckout: React.FC<PayUCheckoutProps> = ({
  bookingId,
  amount,
  productInfo,
  onSuccess,
  onError,
  className = "",
}) => {
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    name: "",
    email: "",
    phone: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState<Partial<CustomerDetails>>({});
  const { toast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: Partial<CustomerDetails> = {};

    if (!customerDetails.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!customerDetails.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerDetails.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!customerDetails.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(customerDetails.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CustomerDetails, value: string) => {
    setCustomerDetails((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Build and validate payment payload
    const paymentRequest = {
      bookingId,
      amount,
      customerName: customerDetails.name,
      customerEmail: customerDetails.email,
      customerPhone: customerDetails.phone,
      productInfo,
    };

    // Check for missing required fields
    const missingFields = Object.entries(paymentRequest)
      .filter(([k, v]) => v === undefined || v === null || v === "")
      .map(([k]) => k);
    if (missingFields.length > 0) {
      toast({
        title: "Missing Payment Details",
        description: `Please provide: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      setIsProcessing(false);
      return;
    }

    // Log payload for debugging
    console.log("[PayU] Payment payload:", paymentRequest);

    try {
      const response = await initiatePayment(paymentRequest);
      console.log("[PayU] Payment response:", response);

      if (response.success && response.paymentData && response.payuUrl) {
        toast({
          title: "Redirecting to Payment",
          description:
            "You will be redirected to PayU for secure payment processing.",
        });

        // Store transaction ID in localStorage for verification after return
        localStorage.setItem("payuTransactionId", response.transactionId || "");

        // Redirect to PayU
        redirectToPayU(response.paymentData, response.payuUrl);

        if (onSuccess) {
          onSuccess();
        }
      } else {
        const errorMsg =
          response.error ||
          "Payment initiation failed. Please try again or contact support.";
        // Show error to user
        toast({
          title: "Payment Error",
          description: errorMsg,
          variant: "destructive",
        });
        if (onError) {
          onError(errorMsg);
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Payment processing failed";
      console.error("[PayU] Payment error:", errorMessage);
      toast({
        title: "Payment Error",
        description: errorMessage,
        variant: "destructive",
      });
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-600" />
          Secure Payment
        </CardTitle>
        <p className="text-sm text-gray-600">
          Amount: ₹{amount.toLocaleString("en-IN")}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="customer-name">Full Name *</Label>
          <Input
            id="customer-name"
            type="text"
            placeholder="Enter your full name"
            value={customerDetails.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={errors.name ? "border-red-500" : ""}
            disabled={isProcessing}
          />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer-email">Email Address *</Label>
          <Input
            id="customer-email"
            type="email"
            placeholder="Enter your email"
            value={customerDetails.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={errors.email ? "border-red-500" : ""}
            disabled={isProcessing}
          />
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer-phone">Phone Number *</Label>
          <Input
            id="customer-phone"
            type="tel"
            placeholder="Enter your phone number"
            value={customerDetails.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className={errors.phone ? "border-red-500" : ""}
            disabled={isProcessing}
          />
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone}</p>
          )}
        </div>

        <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
          <div className="flex items-center gap-2 text-sm text-emerald-700">
            <Shield className="w-4 h-4" />
            <span className="font-medium">Secure Payment</span>
          </div>
          <ul className="mt-2 text-xs text-emerald-600 space-y-1">
            <li className="flex items-center gap-1">
              <Check className="w-3 h-3" />
              SSL encrypted transaction
            </li>
            <li className="flex items-center gap-1">
              <Check className="w-3 h-3" />
              Multiple payment options
            </li>
            <li className="flex items-center gap-1">
              <Check className="w-3 h-3" />
              Secure payment gateway
            </li>
          </ul>
        </div>

        <Button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay ₹{amount.toLocaleString("en-IN")}
            </>
          )}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          By proceeding, you agree to our terms and conditions. You will be
          redirected to PayU for secure payment processing.
        </p>
      </CardContent>
    </Card>
  );
};

export default PayUCheckout;
