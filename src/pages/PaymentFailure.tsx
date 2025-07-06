
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();

  const handleRetryPayment = () => {
    // Go back to the previous page or booking page
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl text-red-800">
                Payment Failed
              </CardTitle>
              <p className="text-red-700">
                Unfortunately, your payment could not be processed
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-3">Payment Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono">{searchParams.get('txnid') || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span>₹{searchParams.get('amount') || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-red-600 font-medium">Failed</span>
                  </div>
                  {searchParams.get('error_Message') && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Error:</span>
                      <span className="text-red-600 text-right max-w-xs">
                        {searchParams.get('error_Message')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-900 mb-2">Common Reasons for Payment Failure</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Insufficient funds in your account</li>
                  <li>• Card expired or blocked</li>
                  <li>• Network connectivity issues</li>
                  <li>• Bank server temporarily unavailable</li>
                  <li>• Incorrect payment details</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">What You Can Do</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Try again with a different payment method</li>
                  <li>• Check your account balance and card validity</li>
                  <li>• Contact your bank if the issue persists</li>
                  <li>• Reach out to our support team for assistance</li>
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleRetryPayment}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                
                <Button 
                  asChild
                  variant="outline" 
                  className="flex-1"
                >
                  <Link to="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Home
                  </Link>
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Need help? Contact our support team
                </p>
                <Button asChild variant="link" className="text-emerald-600">
                  <Link to="/support">
                    Get Support
                  </Link>
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

export default PaymentFailure;
