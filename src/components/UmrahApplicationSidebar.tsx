
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Shield, CheckCircle, FileText } from 'lucide-react';

const UmrahApplicationSidebar = () => {
  return (
    <div className="space-y-4">
      {/* Main Title */}
      <div className="text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          🕋 Apply for Umrah Visa Online
        </h1>
        <p className="text-sm text-gray-600">
          Fast & Guaranteed Approval in 2-4 days
        </p>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center p-3">
          <Clock className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
          <h3 className="font-semibold text-xs text-gray-900 mb-1">Processing Time</h3>
          <p className="text-xs text-gray-600">2-4 business days</p>
        </Card>
        <Card className="text-center p-3">
          <Shield className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
          <h3 className="font-semibold text-xs text-gray-900 mb-1">Approval Rate</h3>
          <p className="text-xs text-gray-600">99% success rate</p>
        </Card>
        <Card className="text-center p-3">
          <CheckCircle className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
          <h3 className="font-semibold text-xs text-gray-900 mb-1">Visa Validity</h3>
          <p className="text-xs text-gray-600">30-90 days</p>
        </Card>
        <Card className="text-center p-3">
          <FileText className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
          <h3 className="font-semibold text-xs text-gray-900 mb-1">Easy Process</h3>
          <p className="text-xs text-gray-600">100% online</p>
        </Card>
      </div>

      {/* Requirements - moved up from bottom */}
      <Card className="p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Requirements</h2>
        <ul className="space-y-1 text-xs text-gray-600">
          <li className="flex items-center">
            <CheckCircle className="w-3 h-3 text-emerald-500 mr-2" />
            Valid passport (6+ months)
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-3 h-3 text-emerald-500 mr-2" />
            Passport-size photograph
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-3 h-3 text-emerald-500 mr-2" />
            Hotel booking confirmation
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-3 h-3 text-emerald-500 mr-2" />
            Return flight tickets
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-3 h-3 text-emerald-500 mr-2" />
            Vaccination certificate
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default UmrahApplicationSidebar;
