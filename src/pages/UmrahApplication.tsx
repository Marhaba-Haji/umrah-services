
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronRight, FileText, User, Plane, CreditCard } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const UmrahApplication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    nationality: '',
    passportNumber: '',
    passportExpiry: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    email: '',
    phone: '',
    
    // Travel Information
    departureDate: '',
    returnDate: '',
    departureCity: '',
    hotelMakkah: '',
    hotelMadinah: '',
    transportType: '',
    
    // Emergency Contact
    emergencyName: '',
    emergencyPhone: '',
    emergencyRelation: ''
  });

  const steps = [
    { number: 1, title: 'Personal Information', icon: User },
    { number: 2, title: 'Travel Details', icon: Plane },
    { number: 3, title: 'Document Upload', icon: FileText },
    { number: 4, title: 'Payment', icon: CreditCard }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <Input
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            placeholder="Enter first name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
          <Input
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            placeholder="Enter last name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
          <Select value={formData.nationality} onValueChange={(value) => handleInputChange('nationality', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select nationality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="US">United States</SelectItem>
              <SelectItem value="IN">India</SelectItem>
              <SelectItem value="PK">Pakistan</SelectItem>
              <SelectItem value="BD">Bangladesh</SelectItem>
              <SelectItem value="ID">Indonesia</SelectItem>
              <SelectItem value="MY">Malaysia</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
          <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Passport Number *</label>
          <Input
            value={formData.passportNumber}
            onChange={(e) => handleInputChange('passportNumber', e.target.value)}
            placeholder="Enter passport number"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Passport Expiry *</label>
          <Input
            type="date"
            value={formData.passportExpiry}
            onChange={(e) => handleInputChange('passportExpiry', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
          <Input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status *</label>
          <Select value={formData.maritalStatus} onValueChange={(value) => handleInputChange('maritalStatus', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select marital status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="married">Married</SelectItem>
              <SelectItem value="divorced">Divorced</SelectItem>
              <SelectItem value="widowed">Widowed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
          <Input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="Enter email address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <Input
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="Enter phone number"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Travel Details</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date *</label>
          <Input
            type="date"
            value={formData.departureDate}
            onChange={(e) => handleInputChange('departureDate', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Return Date *</label>
          <Input
            type="date"
            value={formData.returnDate}
            onChange={(e) => handleInputChange('returnDate', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Departure City *</label>
          <Select value={formData.departureCity} onValueChange={(value) => handleInputChange('departureCity', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select departure city" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NYC">New York</SelectItem>
              <SelectItem value="LON">London</SelectItem>
              <SelectItem value="DEL">Delhi</SelectItem>
              <SelectItem value="MUM">Mumbai</SelectItem>
              <SelectItem value="KHI">Karachi</SelectItem>
              <SelectItem value="DHK">Dhaka</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Hotel in Makkah *</label>
          <Select value={formData.hotelMakkah} onValueChange={(value) => handleInputChange('hotelMakkah', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select hotel in Makkah" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fairmont">Fairmont Makkah Clock Royal Tower</SelectItem>
              <SelectItem value="hilton">Hilton Makkah Convention Hotel</SelectItem>
              <SelectItem value="swissotel">Swissôtel Makkah</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Hotel in Madinah *</label>
          <Select value={formData.hotelMadinah} onValueChange={(value) => handleInputChange('hotelMadinah', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select hotel in Madinah" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="oberoi">The Oberoi Madinah</SelectItem>
              <SelectItem value="hilton-madinah">Hilton Madinah</SelectItem>
              <SelectItem value="anwar">Anwar Al Madinah Movenpick</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Transport Type *</label>
          <Select value={formData.transportType} onValueChange={(value) => handleInputChange('transportType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select transport type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedan">Sedan (3 pax)</SelectItem>
              <SelectItem value="minivan">Mini Van (5 pax)</SelectItem>
              <SelectItem value="gmc">GMC (7 pax)</SelectItem>
              <SelectItem value="largevan">Large Van (10 pax)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-8">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
            <Input
              value={formData.emergencyName}
              onChange={(e) => handleInputChange('emergencyName', e.target.value)}
              placeholder="Emergency contact name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
            <Input
              value={formData.emergencyPhone}
              onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
              placeholder="Emergency contact phone"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Relationship *</label>
            <Select value={formData.emergencyRelation} onValueChange={(value) => handleInputChange('emergencyRelation', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select relationship" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="spouse">Spouse</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="sibling">Sibling</SelectItem>
                <SelectItem value="child">Child</SelectItem>
                <SelectItem value="friend">Friend</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Document Upload</h3>
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Passport Copy *</h4>
          <p className="text-gray-600 mb-4">Upload a clear copy of your passport (first page)</p>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="passport" />
          <Button variant="outline" onClick={() => document.getElementById('passport')?.click()}>
            Choose File
          </Button>
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Passport Size Photo *</h4>
          <p className="text-gray-600 mb-4">Upload a recent passport size photograph (white background)</p>
          <input type="file" accept=".jpg,.jpeg,.png" className="hidden" id="photo" />
          <Button variant="outline" onClick={() => document.getElementById('photo')?.click()}>
            Choose File
          </Button>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Flight Booking Confirmation *</h4>
          <p className="text-gray-600 mb-4">Upload confirmed return flight booking</p>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="flight" />
          <Button variant="outline" onClick={() => document.getElementById('flight')?.click()}>
            Choose File
          </Button>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">Hotel Booking Confirmation *</h4>
          <p className="text-gray-600 mb-4">Upload confirmed hotel booking from approved hotels</p>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" id="hotel" />
          <Button variant="outline" onClick={() => document.getElementById('hotel')?.click()}>
            Choose File
          </Button>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment</h3>
      
      <Card className="bg-emerald-50 border-emerald-200">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-emerald-800 mb-4">Application Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Umrah Visa Processing Fee:</span>
              <span className="font-semibold">$299</span>
            </div>
            <div className="flex justify-between">
              <span>Service Fee:</span>
              <span className="font-semibold">$50</span>
            </div>
            <div className="flex justify-between">
              <span>Processing Speed (3-5 days):</span>
              <span className="font-semibold">$75</span>
            </div>
            <hr className="my-2 border-emerald-300" />
            <div className="flex justify-between text-lg font-bold text-emerald-800">
              <span>Total Amount:</span>
              <span>$424</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg font-semibold"
          onClick={() => {
            // Integration with payment gateway would go here
            window.open('https://checkout.stripe.com', '_blank');
          }}
        >
          💳 Pay Now - $424
        </Button>
        <p className="text-sm text-gray-600 mt-4">
          🔒 Secure payment powered by Stripe. Your card details are safe and encrypted.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50">
      <Header />
      
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🕋 Umrah Visa Application
            </h1>
            <p className="text-xl text-gray-600">Complete your application in 4 simple steps</p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.number 
                      ? 'bg-emerald-600 border-emerald-600 text-white' 
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    currentStep >= step.number ? 'text-emerald-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                  {index < steps.length - 1 && (
                    <ChevronRight className="w-5 h-5 text-gray-400 ml-4" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button 
                  variant="outline" 
                  onClick={prevStep} 
                  disabled={currentStep === 1}
                  className="px-6"
                >
                  Previous
                </Button>
                {currentStep < 4 ? (
                  <Button 
                    onClick={nextStep}
                    className="bg-emerald-600 hover:bg-emerald-700 px-6"
                  >
                    Next Step
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UmrahApplication;
