import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, ArrowRight } from "lucide-react";
import { verifyPayment } from "@/services/paymentService";
import { useToast } from "@/hooks/use-toast";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    verified?: boolean;
    status?: string;
    transactionId?: string;
    error?: string;
  } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === "/payment-success") {
      navigate("/payment/success", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const verifyPaymentResult = async () => {
      try {
        // Get PayU response parameters
        const payuResponse = {
          mihpayid: searchParams.get("mihpayid"),
          mode: searchParams.get("mode"),
          status: searchParams.get("status"),
          txnid: searchParams.get("txnid"),
          amount: searchParams.get("amount"),
          productinfo: searchParams.get("productinfo"),
          firstname: searchParams.get("firstname"),
          email: searchParams.get("email"),
          phone: searchParams.get("phone"),
          hash: searchParams.get("hash"),
        };

        const merchantTransactionId = searchParams.get("txnid") || "";

        if (payuResponse.status === "success" && merchantTransactionId) {
          const result = await verifyPayment(
            payuResponse,
            merchantTransactionId,
          );
          setVerificationResult(result);

          if (result.success && result.verified) {
            toast({
              title: "Payment Successful!",
              description: "Your payment has been processed successfully.",
            });
          } else {
            toast({
              title: "Payment Verification Failed",
              description:
                "There was an issue verifying your payment. Please contact support.",
              variant: "destructive",
            });
          }
        } else {
          throw new Error("Invalid payment response");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        toast({
          title: "Verification Error",
          description: "Unable to verify payment. Please contact support.",
          variant: "destructive",
        });
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPaymentResult();
  }, [searchParams, toast]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Verifying Payment
            </h2>
            <p className="text-gray-600">
              Please wait while we confirm your payment...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl text-green-800">
                Payment Successful!
              </CardTitle>
              <p className="text-green-700">
                Your payment has been processed successfully
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Payment Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono">
                      {searchParams.get("txnid")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-semibold">
                      ₹{searchParams.get("amount")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span>{searchParams.get("mode")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">PayU Transaction ID:</span>
                    <span className="font-mono">
                      {searchParams.get("mihpayid")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">What's Next?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Your booking has been confirmed</li>
                  <li>• You will receive a confirmation email shortly</li>
                  <li>• Our team will contact you with further details</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  asChild
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Link to="/">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Continue Browsing
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.print()}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Print Receipt
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaymentSuccess;
