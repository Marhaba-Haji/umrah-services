
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PayUCheckout from './PayUCheckout';
import { FileText, CreditCard, Clock, Shield } from 'lucide-react';

interface UmrahVisaPaymentProps {
  visaType: string;
  amount: number;
  processingTime: string;
  onPaymentSuccess?: () => void;
}

const UmrahVisaPayment: React.FC<UmrahVisaPaymentProps> = ({
  visaType,
  amount,
  processingTime,
  onPaymentSuccess
}) => {
  const [showCheckout, setShowCheckout] = useState(false);

  // Create a mock booking ID for demonstration
  const bookingId = `visa_${Date.now()}`;
  const productInfo = `Umrah Visa Processing - ${visaType}`;

  const handleProceedToPayment = () => {
    setShowCheckout(true);
  };

  const handlePaymentSuccess = () => {
    setShowCheckout(false);
    if (onPaymentSuccess) {
      onPaymentSuccess();
    }
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    // Optionally show an error message to the user
  };

  if (showCheckout) {
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
          bookingId={bookingId}
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
              <span className="text-emerald-600">₹{amount.toLocaleString('en-IN')}</span>
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
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          size="lg"
        >
          <CreditCard className="w-4 h-4 mr-2" />
          Proceed to Payment
        </Button>

        <p className="text-xs text-gray-500 text-center">
          Secure payment processing powered by PayU. 
          Your payment information is encrypted and protected.
        </p>
      </CardContent>
    </Card>
  );
};

export default UmrahVisaPayment;
