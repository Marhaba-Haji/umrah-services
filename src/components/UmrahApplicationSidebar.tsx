
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Shield, CheckCircle, FileText } from 'lucide-react';

const UmrahApplicationSidebar = () => {
  return (
    <div className="space-y-6">
      {/* Main Title */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          🕋 Apply for Umrah Visa Online
        </h1>
        <p className="text-gray-600">
          Fast & Guaranteed Approval in 1-5 days
        </p>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="text-center p-4">
          <Clock className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
          <h3 className="font-semibold text-sm text-gray-900 mb-1">Processing Time</h3>
          <p className="text-xs text-gray-600">1-5 business days</p>
        </Card>
        <Card className="text-center p-4">
          <Shield className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
          <h3 className="font-semibold text-sm text-gray-900 mb-1">Approval Rate</h3>
          <p className="text-xs text-gray-600">99% success rate</p>
        </Card>
        <Card className="text-center p-4">
          <CheckCircle className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
          <h3 className="font-semibold text-sm text-gray-900 mb-1">Visa Validity</h3>
          <p className="text-xs text-gray-600">30-90 days</p>
        </Card>
        <Card className="text-center p-4">
          <FileText className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
          <h3 className="font-semibold text-sm text-gray-900 mb-1">Easy Process</h3>
          <p className="text-xs text-gray-600">100% online</p>
        </Card>
      </div>

      {/* Visa Types and Pricing */}
      <Card className="p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Visa Types & Pricing</h2>
        <div className="space-y-3">
          <div className="text-center p-3 border rounded-lg">
            <Badge className="bg-blue-100 text-blue-800 mb-2">Standard</Badge>
            <h3 className="font-semibold text-sm mb-1">5-7 Business Days</h3>
            <p className="text-lg font-bold text-emerald-600">$299</p>
          </div>
          <div className="text-center p-3 border-2 border-emerald-500 rounded-lg bg-emerald-50">
            <Badge className="bg-emerald-100 text-emerald-800 mb-2">Express</Badge>
            <h3 className="font-semibold text-sm mb-1">3-5 Business Days</h3>
            <p className="text-lg font-bold text-emerald-600">$449</p>
          </div>
          <div className="text-center p-3 border rounded-lg">
            <Badge className="bg-red-100 text-red-800 mb-2">Rush</Badge>
            <h3 className="font-semibold text-sm mb-1">1-3 Business Days</h3>
            <p className="text-lg font-bold text-emerald-600">$699</p>
          </div>
        </div>
      </Card>

      {/* Requirements */}
      <Card className="p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Requirements</h2>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
            Valid passport (6+ months)
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
            Passport-size photograph
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
            Hotel booking confirmation
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
            Return flight tickets
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 text-emerald-500 mr-2" />
            Vaccination certificate
          </li>
        </ul>
      </Card>

      {/* FAQ */}
      <Card className="p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Quick FAQ</h2>
        <div className="space-y-3 text-sm">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">How long does processing take?</h3>
            <p className="text-gray-600">1-7 business days depending on your chosen service.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">What is the validity period?</h3>
            <p className="text-gray-600">Umrah visas are valid for 30-90 days from issue date.</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">Is approval guaranteed?</h3>
            <p className="text-gray-600">We have a 99% approval rate with full refund if rejected.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UmrahApplicationSidebar;
