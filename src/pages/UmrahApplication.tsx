import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, FileText, User, Plane, CreditCard, Plus, Minus } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UmrahApplicationSidebar from '../components/UmrahApplicationSidebar';
import FAQSection from '../components/FAQSection';

const UmrahApplication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [travelerCount, setTravelerCount] = useState(1);
  const [currentTraveler, setCurrentTraveler] = useState(0);
  const [travelers, setTravelers] = useState([
    {
      // Personal Information
      firstName: '',
      lastName: '',
      nationality: '',
      passportNumber: '',
      passportIssue: '',
      passportExpiry: '',
      dateOfBirth: '',
      gender: '',
      email: '',
      phone: '',
      // Travel Information
      departureDate: '',
      returnDate: '',
      departureCity: '',
      hotelMakkah: '',
      hotelMadinah: '',
      transportType: '',
    }
  ]);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    nationality: '',
    passportNumber: '',
    passportIssue: '',
    passportExpiry: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    
    // Travel Information
    departureDate: '',
    returnDate: '',
    departureCity: '',
    hotelMakkah: '',
    hotelMadinah: '',
    transportType: '',
  });
  const [passportDateError, setPassportDateError] = useState('');
  const [passportExpiryAlert, setPassportExpiryAlert] = useState('');
  const [dateError, setDateError] = useState('');
  const MAX_IMAGE_SIZE_MB = 2;
  const [uploadPreviews, setUploadPreviews] = useState({
    passportFront: '',
    passportBack: '',
    photo: '',
    flight: '',
    makkahHotel: '',
    madinahHotel: ''
  });
  const [uploadErrors, setUploadErrors] = useState({
    passportFront: '',
    passportBack: '',
    photo: '',
    flight: '',
    makkahHotel: '',
    madinahHotel: ''
  });
  const [sameAsFirst, setSameAsFirst] = useState(false);
  const [visaType, setVisaType] = useState('express');
  const visaPrices = {
    standard: 299,
    express: 449,
    rush: 699
  };

  const steps = [
    { number: 1, title: 'Personal Information', icon: User },
    { number: 2, title: 'Travel Details', icon: Plane },
    { number: 3, title: 'Document Upload', icon: FileText },
    { number: 4, title: 'Payment', icon: CreditCard }
  ];

  const handleTravelerInputChange = (field: string, value: string) => {
    setTravelers(prev => {
      const updated = [...prev];
      updated[currentTraveler] = { ...updated[currentTraveler], [field]: value };
      return updated;
    });
    if (field === 'passportIssue' || field === 'passportExpiry') {
      // Validate issue < expiry
      const issue = field === 'passportIssue' ? value : formData.passportIssue;
      const expiry = field === 'passportExpiry' ? value : formData.passportExpiry;
      if (issue && expiry && new Date(issue) >= new Date(expiry)) {
        setPassportDateError('Passport issue date must be before expiry date.');
      } else {
        setPassportDateError('');
      }
      // Validate expiry at least 180 days from today
      if (expiry) {
        const today = new Date();
        const expiryDate = new Date(expiry);
        const diffDays = (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays < 180) {
          setPassportExpiryAlert('Passport expiry date must be at least 180 days from today!');
        } else {
          setPassportExpiryAlert('');
        }
      } else {
        setPassportExpiryAlert('');
      }
    }
    if (field === 'departureDate' || field === 'returnDate') {
      const today = new Date();
      today.setHours(0,0,0,0);
      const dep = field === 'departureDate' ? value : formData.departureDate;
      const ret = field === 'returnDate' ? value : formData.returnDate;
      let error = '';
      if (dep) {
        const depDate = new Date(dep);
        const diffDep = (depDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDep < 3) error = 'Departure date must be at least 3 days from today.';
      }
      if (ret) {
        const retDate = new Date(ret);
        const diffRet = (retDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        if (diffRet < 3) error = 'Return date must be at least 3 days from today.';
      }
      setDateError(error);
    }
  };

  const handleImageUpload = (field: string, file: File | null) => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setUploadErrors(prev => ({ ...prev, [field]: 'Only JPG, JPEG, PNG files are allowed.' }));
      setUploadPreviews(prev => ({ ...prev, [field]: '' }));
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setUploadErrors(prev => ({ ...prev, [field]: `Max file size is ${MAX_IMAGE_SIZE_MB}MB.` }));
      setUploadPreviews(prev => ({ ...prev, [field]: '' }));
      return;
    }
    setUploadErrors(prev => ({ ...prev, [field]: '' }));
    const reader = new FileReader();
    reader.onload = e => {
      setUploadPreviews(prev => ({ ...prev, [field]: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleTravelerCountChange = (value: string) => {
    const count = Math.max(1, parseInt(value) || 1);
    setTravelerCount(count);
    setTravelers(prev => {
      const arr = [...prev];
      while (arr.length < count) arr.push({ ...arr[0] });
      return arr.slice(0, count);
    });
    setCurrentTraveler(0);
  };

  const handleSameAsFirstChange = (checked: boolean) => {
    setSameAsFirst(checked);
    if (checked && currentTraveler > 0) {
      setTravelers(prev => {
        const updated = [...prev];
        updated[currentTraveler] = {
          ...updated[currentTraveler],
          departureDate: travelers[0].departureDate,
          returnDate: travelers[0].returnDate,
          departureCity: travelers[0].departureCity,
          hotelMakkah: travelers[0].hotelMakkah,
          hotelMadinah: travelers[0].hotelMadinah,
          transportType: travelers[0].transportType,
        };
        return updated;
      });
      setUploadPreviews(prev => ({
        ...prev,
        flight: uploadPreviews.flight,
        makkahHotel: uploadPreviews.makkahHotel,
        madinahHotel: uploadPreviews.madinahHotel
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const totalVisaPrice = visaPrices[visaType] * travelerCount;

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h3>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <Input
            value={travelers[currentTraveler].firstName}
            onChange={(e) => handleTravelerInputChange('firstName', e.target.value)}
            placeholder="Enter first name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
          <Input
            value={travelers[currentTraveler].lastName}
            onChange={(e) => handleTravelerInputChange('lastName', e.target.value)}
            placeholder="Enter last name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
          <Select value={travelers[currentTraveler].nationality} onValueChange={(value) => handleTravelerInputChange('nationality', value)}>
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
          <Select value={travelers[currentTraveler].gender} onValueChange={(value) => handleTravelerInputChange('gender', value)}>
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
            value={travelers[currentTraveler].passportNumber}
            onChange={(e) => handleTravelerInputChange('passportNumber', e.target.value)}
            placeholder="Enter passport number"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Passport Issue Date *</label>
            <Input
              type="date"
              value={travelers[currentTraveler].passportIssue}
              onChange={(e) => handleTravelerInputChange('passportIssue', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Passport Expiry *</label>
          <Input
            type="date"
              value={travelers[currentTraveler].passportExpiry}
              onChange={(e) => handleTravelerInputChange('passportExpiry', e.target.value)}
          />
          </div>
        </div>
        {passportDateError && <div className="text-red-600 text-sm col-span-2">{passportDateError}</div>}
        {passportExpiryAlert && <div className="text-yellow-600 text-sm col-span-2">{passportExpiryAlert}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
          <Input
            type="date"
            value={travelers[currentTraveler].dateOfBirth}
            onChange={(e) => handleTravelerInputChange('dateOfBirth', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <Input
            type="email"
            value={travelers[currentTraveler].email}
            onChange={(e) => handleTravelerInputChange('email', e.target.value)}
            placeholder="Enter email address"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <Input
            value={travelers[currentTraveler].phone}
            onChange={(e) => handleTravelerInputChange('phone', e.target.value)}
            placeholder="Enter phone number"
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Travel Details</h3>
      {currentTraveler > 0 && (
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="sameAsFirst"
            checked={sameAsFirst}
            onChange={e => handleSameAsFirstChange(e.target.checked)}
          />
          <label htmlFor="sameAsFirst" className="text-sm font-medium text-gray-700">Same as Traveler 1</label>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Departure Date *</label>
          <Input
            type="date"
            value={travelers[currentTraveler].departureDate}
            onChange={(e) => handleTravelerInputChange('departureDate', e.target.value)}
            disabled={sameAsFirst && currentTraveler > 0}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Return Date *</label>
          <Input
            type="date"
            value={travelers[currentTraveler].returnDate}
            onChange={(e) => handleTravelerInputChange('returnDate', e.target.value)}
            disabled={sameAsFirst && currentTraveler > 0}
          />
        </div>
        {dateError && <div className="text-red-600 text-sm col-span-2">{dateError}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Departure City *</label>
          <Input
            value={travelers[currentTraveler].departureCity}
            onChange={(e) => handleTravelerInputChange('departureCity', e.target.value)}
            placeholder="Enter departure city"
            disabled={sameAsFirst && currentTraveler > 0}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Hotel in Makkah *</label>
          <Input
            value={travelers[currentTraveler].hotelMakkah}
            onChange={(e) => handleTravelerInputChange('hotelMakkah', e.target.value)}
            placeholder="Enter hotel name in Makkah"
            disabled={sameAsFirst && currentTraveler > 0}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Hotel in Madinah *</label>
          <Input
            value={travelers[currentTraveler].hotelMadinah}
            onChange={(e) => handleTravelerInputChange('hotelMadinah', e.target.value)}
            placeholder="Enter hotel name in Madinah"
            disabled={sameAsFirst && currentTraveler > 0}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Transport Type *</label>
          <Select value={travelers[currentTraveler].transportType} onValueChange={(value) => handleTravelerInputChange('transportType', value)} disabled={sameAsFirst && currentTraveler > 0}>
            <SelectTrigger>
              <SelectValue placeholder="Select transport type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedan">Sedan (3 pax)</SelectItem>
              <SelectItem value="minivan">Mini Van (5 pax)</SelectItem>
              <SelectItem value="gmc">GMC (7 pax)</SelectItem>
              <SelectItem value="largevan">Large Van (10 pax)</SelectItem>
              <SelectItem value="coaster">Coaster (20 pax)</SelectItem>
              <SelectItem value="bus">Bus (50 pax)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Document Upload</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {/* Passport Front Page */}
        <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
          <h4 className="font-medium mb-1">Passport Front Page *</h4>
          <p className="text-xs text-gray-500 mb-2">JPG, JPEG, PNG only. Max size: {MAX_IMAGE_SIZE_MB}MB.</p>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            className="hidden"
            id="passportFront"
            onChange={e => handleImageUpload('passportFront', e.target.files?.[0] || null)}
            disabled={sameAsFirst && currentTraveler > 0}
          />
          <Button variant="outline" onClick={() => document.getElementById('passportFront')?.click()} size="sm" disabled={sameAsFirst && currentTraveler > 0}>Upload</Button>
          {uploadPreviews.passportFront && <img src={uploadPreviews.passportFront} alt="Passport Front Preview" className="mt-2 w-32 h-20 object-cover rounded border" />}
          {uploadErrors.passportFront && <div className="text-red-600 text-xs mt-1">{uploadErrors.passportFront}</div>}
        </div>
        {/* Passport Back Page */}
        <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
          <h4 className="font-medium mb-1">Passport Back Page *</h4>
          <p className="text-xs text-gray-500 mb-2">JPG, JPEG, PNG only. Max size: {MAX_IMAGE_SIZE_MB}MB.</p>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            className="hidden"
            id="passportBack"
            onChange={e => handleImageUpload('passportBack', e.target.files?.[0] || null)}
            disabled={sameAsFirst && currentTraveler > 0}
          />
          <Button variant="outline" onClick={() => document.getElementById('passportBack')?.click()} size="sm" disabled={sameAsFirst && currentTraveler > 0}>Upload</Button>
          {uploadPreviews.passportBack && <img src={uploadPreviews.passportBack} alt="Passport Back Preview" className="mt-2 w-32 h-20 object-cover rounded border" />}
          {uploadErrors.passportBack && <div className="text-red-600 text-xs mt-1">{uploadErrors.passportBack}</div>}
        </div>
        {/* Passport Size Photo */}
        <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
          <h4 className="font-medium mb-1">Passport Size Photo *</h4>
          <p className="text-xs text-gray-500 mb-2">JPG, JPEG, PNG only. Max size: {MAX_IMAGE_SIZE_MB}MB.</p>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            className="hidden"
            id="photo"
            onChange={e => handleImageUpload('photo', e.target.files?.[0] || null)}
            disabled={sameAsFirst && currentTraveler > 0}
          />
          <Button variant="outline" onClick={() => document.getElementById('photo')?.click()} size="sm" disabled={sameAsFirst && currentTraveler > 0}>Upload</Button>
          {uploadPreviews.photo && <img src={uploadPreviews.photo} alt="Photo Preview" className="mt-2 w-20 h-20 object-cover rounded-full border" />}
          {uploadErrors.photo && <div className="text-red-600 text-xs mt-1">{uploadErrors.photo}</div>}
        </div>
        {/* Flight Booking Confirmation */}
        <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
          <h4 className="font-medium mb-1">Flight Booking Confirmation *</h4>
          <p className="text-xs text-gray-500 mb-2">JPG, JPEG, PNG only. Max size: {MAX_IMAGE_SIZE_MB}MB.</p>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            className="hidden"
            id="flight"
            onChange={e => handleImageUpload('flight', e.target.files?.[0] || null)}
            disabled={sameAsFirst && currentTraveler > 0}
          />
          <Button variant="outline" onClick={() => document.getElementById('flight')?.click()} size="sm" disabled={sameAsFirst && currentTraveler > 0}>Upload</Button>
          {(sameAsFirst && currentTraveler > 0 && uploadPreviews.flight) ? (
            <img src={uploadPreviews.flight} alt="Flight Preview" className="mt-2 w-32 h-20 object-cover rounded border" />
          ) : (
            uploadPreviews.flight && <img src={uploadPreviews.flight} alt="Flight Preview" className="mt-2 w-32 h-20 object-cover rounded border" />
          )}
          {uploadErrors.flight && <div className="text-red-600 text-xs mt-1">{uploadErrors.flight}</div>}
        </div>
        {/* Makkah Hotel Booking Confirmation */}
        <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
          <h4 className="font-medium mb-1">Makkah Hotel Booking Confirmation *</h4>
          <p className="text-xs text-gray-500 mb-2">JPG, JPEG, PNG only. Max size: {MAX_IMAGE_SIZE_MB}MB.</p>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            className="hidden"
            id="makkahHotel"
            onChange={e => handleImageUpload('makkahHotel', e.target.files?.[0] || null)}
            disabled={sameAsFirst && currentTraveler > 0}
          />
          <Button variant="outline" onClick={() => document.getElementById('makkahHotel')?.click()} size="sm" disabled={sameAsFirst && currentTraveler > 0}>Upload</Button>
          {(sameAsFirst && currentTraveler > 0 && uploadPreviews.makkahHotel) ? (
            <img src={uploadPreviews.makkahHotel} alt="Makkah Hotel Preview" className="mt-2 w-32 h-20 object-cover rounded border" />
          ) : (
            uploadPreviews.makkahHotel && <img src={uploadPreviews.makkahHotel} alt="Makkah Hotel Preview" className="mt-2 w-32 h-20 object-cover rounded border" />
          )}
          {uploadErrors.makkahHotel && <div className="text-red-600 text-xs mt-1">{uploadErrors.makkahHotel}</div>}
        </div>
        {/* Madinah Hotel Booking Confirmation */}
        <div className="border border-gray-200 rounded-lg p-4 flex flex-col items-center">
          <h4 className="font-medium mb-1">Madinah Hotel Booking Confirmation *</h4>
          <p className="text-xs text-gray-500 mb-2">JPG, JPEG, PNG only. Max size: {MAX_IMAGE_SIZE_MB}MB.</p>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            className="hidden"
            id="madinahHotel"
            onChange={e => handleImageUpload('madinahHotel', e.target.files?.[0] || null)}
            disabled={sameAsFirst && currentTraveler > 0}
          />
          <Button variant="outline" onClick={() => document.getElementById('madinahHotel')?.click()} size="sm" disabled={sameAsFirst && currentTraveler > 0}>Upload</Button>
          {(sameAsFirst && currentTraveler > 0 && uploadPreviews.madinahHotel) ? (
            <img src={uploadPreviews.madinahHotel} alt="Madinah Hotel Preview" className="mt-2 w-32 h-20 object-cover rounded border" />
          ) : (
            uploadPreviews.madinahHotel && <img src={uploadPreviews.madinahHotel} alt="Madinah Hotel Preview" className="mt-2 w-32 h-20 object-cover rounded border" />
          )}
          {uploadErrors.madinahHotel && <div className="text-red-600 text-xs mt-1">{uploadErrors.madinahHotel}</div>}
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
              <span>Visa Type:</span>
              <span className="font-semibold capitalize">{visaType}</span>
            </div>
            <div className="flex justify-between">
              <span>Visa Fee per Traveler:</span>
              <span className="font-semibold">${visaPrices[visaType]}</span>
            </div>
            <div className="flex justify-between">
              <span>Number of Travelers:</span>
              <span className="font-semibold">{travelerCount}</span>
            </div>
            <hr className="my-2 border-emerald-300" />
            <div className="flex justify-between text-lg font-bold text-emerald-800">
              <span>Total Visa Amount:</span>
              <span>${totalVisaPrice}</span>
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
          💳 Pay Now - ${totalVisaPrice}
        </Button>
        <p className="text-sm text-gray-600 mt-4">
          🔒 Secure payment powered by Stripe. Your card details are safe and encrypted.
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Left Sidebar - Information */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <UmrahApplicationSidebar />
            </div>
          </div>

          {/* Right Content - Form Flow */}
          <div className="lg:col-span-3">
            {/* Visa Types and Pricing - moved here from sidebar */}
            <Card className="p-4 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Select Umrah Visa Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div
                  className={`text-center p-2 border rounded cursor-pointer transition-all ${visaType === 'standard' ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-400' : ''}`}
                  onClick={() => setVisaType('standard')}
                >
                  <Badge className="bg-blue-100 text-blue-800 mb-1 text-xs px-2 py-1 rounded">Standard</Badge>
                  <h3 className="font-semibold text-xs mb-1">5-7 Business Days</h3>
                  <p className="text-xl font-bold text-emerald-600">${visaPrices.standard}</p>
                </div>
                <div
                  className={`text-center p-2 border rounded cursor-pointer transition-all ${visaType === 'express' ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-400' : ''}`}
                  onClick={() => setVisaType('express')}
                >
                  <Badge className="bg-emerald-100 text-emerald-800 mb-1 text-xs px-2 py-1 rounded">Express</Badge>
                  <h3 className="font-semibold text-xs mb-1">2-4 Business Days</h3>
                  <p className="text-xl font-bold text-emerald-600">${visaPrices.express}</p>
                </div>
                <div
                  className={`text-center p-2 border rounded cursor-pointer transition-all ${visaType === 'rush' ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-400' : ''}`}
                  onClick={() => setVisaType('rush')}
                >
                  <Badge className="bg-red-100 text-red-800 mb-1 text-xs px-2 py-1 rounded">Rush</Badge>
                  <h3 className="font-semibold text-xs mb-1">1-2 Business Days</h3>
                  <p className="text-xl font-bold text-emerald-600">${visaPrices.rush}</p>
                </div>
              </div>
            </Card>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      currentStep >= step.number 
                        ? 'bg-emerald-600 border-emerald-600 text-white' 
                        : 'border-gray-300 text-gray-400'
                    }`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <span className={`ml-2 text-sm font-medium hidden md:block ${
                      currentStep >= step.number ? 'text-emerald-600' : 'text-gray-400'
                    }`}>
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <ChevronRight className="w-5 h-5 text-gray-400 ml-4 hidden md:block" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Form Content */}
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <div className="mb-8 flex items-center gap-4">
                  <label className="block text-lg font-semibold text-gray-900">Number of Travelers / Visas Required</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => handleTravelerCountChange(String(Math.max(1, travelerCount - 1)))}
                    disabled={travelerCount <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-xl font-bold w-8 text-center">{travelerCount}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() => handleTravelerCountChange(String(travelerCount + 1))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mb-4">
                  <Badge className="bg-emerald-100 text-emerald-800">Traveler {currentTraveler + 1} of {travelerCount}</Badge>
                </div>
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
                {currentStep === 4 && currentTraveler < travelerCount - 1 ? (
                  <div className="text-center my-8">
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg font-semibold"
                      onClick={() => {
                        setCurrentTraveler(currentTraveler + 1);
                        setCurrentStep(1);
                      }}
                    >
                      Add Traveler {currentTraveler + 2} Details
                    </Button>
                    <p className="text-sm text-gray-600 mt-2">Please add details for all travelers before proceeding to payment.</p>
                  </div>
                ) : null}
                {currentStep === 4 && currentTraveler === travelerCount - 1 && renderStep4()}

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
        </div>
      </div>

      {/* FAQ Section - Full Width */}
      <FAQSection />

      <Footer />
    </div>
  );
};

export default UmrahApplication;
