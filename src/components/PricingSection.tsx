
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Transparent Pricing for All Countries
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            No hidden fees, no surprises. Our pricing varies by nationality and processing speed. 
            Check your country-specific rates below.
          </p>
        </div>

        {/* Country Pricing Table */}
        <div className="max-w-6xl mx-auto mb-16">
          <Card className="overflow-hidden">
            <CardHeader className="bg-emerald-600 text-white text-center">
              <CardTitle className="text-2xl">Umrah Visa Pricing by Country</CardTitle>
              <p className="text-emerald-100">Select your nationality to see exact pricing</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold text-gray-900">Country/Region</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-900">Standard (3-5 days)</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-900">Express (24-48 hrs)</th>
                      <th className="px-6 py-4 text-center font-semibold text-gray-900">Multiple Entry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">🇺🇸 United States</td>
                      <td className="px-6 py-4 text-center">$149</td>
                      <td className="px-6 py-4 text-center">$249</td>
                      <td className="px-6 py-4 text-center">$299</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">🇬🇧 United Kingdom</td>
                      <td className="px-6 py-4 text-center">$159</td>
                      <td className="px-6 py-4 text-center">$259</td>
                      <td className="px-6 py-4 text-center">$309</td>
                    </tr>
                    <tr className="hover:bg-gray-50 bg-emerald-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        🇮🇳 India 
                        <Badge className="ml-2 bg-emerald-100 text-emerald-800">Popular</Badge>
                      </td>
                      <td className="px-6 py-4 text-center font-semibold text-emerald-600">$99</td>
                      <td className="px-6 py-4 text-center font-semibold text-emerald-600">$179</td>
                      <td className="px-6 py-4 text-center font-semibold text-emerald-600">$219</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">🇵🇰 Pakistan</td>
                      <td className="px-6 py-4 text-center">$109</td>
                      <td className="px-6 py-4 text-center">$189</td>
                      <td className="px-6 py-4 text-center">$229</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">🇧🇩 Bangladesh</td>
                      <td className="px-6 py-4 text-center">$119</td>
                      <td className="px-6 py-4 text-center">$199</td>
                      <td className="px-6 py-4 text-center">$239</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">🇮🇩 Indonesia</td>
                      <td className="px-6 py-4 text-center">$129</td>
                      <td className="px-6 py-4 text-center">$209</td>
                      <td className="px-6 py-4 text-center">$249</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">🇲🇾 Malaysia</td>
                      <td className="px-6 py-4 text-center">$139</td>
                      <td className="px-6 py-4 text-center">$219</td>
                      <td className="px-6 py-4 text-center">$259</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">🌍 Other Countries</td>
                      <td className="px-6 py-4 text-center">From $99</td>
                      <td className="px-6 py-4 text-center">From $179</td>
                      <td className="px-6 py-4 text-center">From $219</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* What's Included */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900">What's Included in Every Package</CardTitle>
              <p className="text-gray-600">All prices include the following services at no extra cost</p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                    Document Services
                  </h4>
                  <ul className="space-y-2 ml-5">
                    <li className="text-gray-600 flex items-center">
                      <span className="text-emerald-500 mr-2">✓</span>
                      Document review and verification
                    </li>
                    <li className="text-gray-600 flex items-center">
                      <span className="text-emerald-500 mr-2">✓</span>
                      Form filling assistance
                    </li>
                    <li className="text-gray-600 flex items-center">
                      <span className="text-emerald-500 mr-2">✓</span>
                      Photo compliance check
                    </li>
                    <li className="text-gray-600 flex items-center">
                      <span className="text-emerald-500 mr-2">✓</span>
                      Digital document storage
                    </li>
                  </ul>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
                    Support Services
                  </h4>
                  <ul className="space-y-2 ml-5">
                    <li className="text-gray-600 flex items-center">
                      <span className="text-emerald-500 mr-2">✓</span>
                      24/7 customer support
                    </li>
                    <li className="text-gray-600 flex items-center">
                      <span className="text-emerald-500 mr-2">✓</span>
                      Real-time status updates
                    </li>
                    <li className="text-gray-600 flex items-center">
                      <span className="text-emerald-500 mr-2">✓</span>
                      SMS and email notifications
                    </li>
                    <li className="text-gray-600 flex items-center">
                      <span className="text-emerald-500 mr-2">✓</span>
                      Travel guidance and tips
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 p-6 bg-emerald-50 rounded-lg">
                <div className="text-center">
                  <h4 className="font-semibold text-emerald-800 mb-2">Money Back Guarantee</h4>
                  <p className="text-emerald-700 text-sm">
                    If your visa is rejected due to our error, we'll refund 100% of your service fee. 
                    Terms and conditions apply.
                  </p>
                </div>
              </div>

              <div className="text-center mt-8">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg">
                  Get Your Exact Quote Now
                </Button>
                <p className="text-sm text-gray-500 mt-2">
                  Price calculation based on your nationality and travel dates
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
