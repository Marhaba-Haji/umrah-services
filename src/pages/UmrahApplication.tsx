import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  FileText,
  User,
  Plane,
  CreditCard,
  Plus,
  Minus,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UmrahApplicationSidebar from "../components/UmrahApplicationSidebar";
import FAQSection from "../components/FAQSection";
import { supabase } from "@/integrations/supabase/client";
import UmrahVisaPayment from "../components/UmrahVisaPayment";
import { format, addDays, parseISO, isAfter, isBefore } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface VisaOption {
  visa_category?: string;
  processing_time?: string;
  price?: number;
  approval_rate?: number;
  // add other fields as needed
}

function generateUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16),
  );
}

const UmrahApplication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [travelerCount, setTravelerCount] = useState(1);
  const [currentTraveler, setCurrentTraveler] = useState(0);
  const [travelers, setTravelers] = useState([
    {
      // Personal Information
      firstName: "",
      lastName: "",
      nationality: "",
      passportNumber: "",
      passportIssue: "",
      passportExpiry: "",
      dateOfBirth: "",
      gender: "",
      email: "",
      phone: "",
      // Travel Information
      departureDate: "",
      returnDate: "",
      departureCity: "",
      hotelMakkah: "",
      hotelMadinah: "",
      transportType: "",
    },
  ]);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    nationality: "",
    passportNumber: "",
    passportIssue: "",
    passportExpiry: "",
    dateOfBirth: "",
    gender: "",
    email: "",
    phone: "",

    // Travel Information
    departureDate: "",
    returnDate: "",
    departureCity: "",
    hotelMakkah: "",
    hotelMadinah: "",
    transportType: "",
  });
  const [passportDateError, setPassportDateError] = useState("");
  const [passportExpiryAlert, setPassportExpiryAlert] = useState("");
  const [dateError, setDateError] = useState("");
  const MAX_IMAGE_SIZE_MB = 2;
  const [uploadPreviews, setUploadPreviews] = useState({
    passportFront: "",
    passportBack: "",
    photo: "",
    flight: "",
    makkahHotel: "",
    madinahHotel: "",
  });
  const [uploadErrors, setUploadErrors] = useState({
    passportFront: "",
    passportBack: "",
    photo: "",
    flight: "",
    makkahHotel: "",
    madinahHotel: "",
    general: "",
  });
  const [sameAsFirst, setSameAsFirst] = useState(false);
  const [visaType, setVisaType] = useState("express");
  const [visaOptions, setVisaOptions] = useState<VisaOption[]>([]);
  const [loadingVisas, setLoadingVisas] = useState(true);
  const { toast } = useToast();
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const savingRef = useRef(false);
  const [customerId, setCustomerId] = useState<string | null>(null);

  const steps = [
    { number: 1, title: "Personal Information", icon: User },
    { number: 2, title: "Travel Details", icon: Plane },
    { number: 3, title: "Document Upload", icon: FileText },
    { number: 4, title: "Payment", icon: CreditCard },
  ];

  useEffect(() => {
    async function fetchVisaOptions() {
      setLoadingVisas(true);
      const { data, error } = await supabase
        .from("saudi_visas")
        .select("visa_category, price, processing_time, approval_rate")
        .eq("visa_type", "Umrah Visa")
        .in("visa_category", ["Standard", "Premium", "Express"])
        .eq("status", "active");
      if (data) {
        // Ensure order: Standard, Premium, Express
        const order = ["Standard", "Premium", "Express"];
        setVisaOptions(
          order.map((cat) => data.find((v) => v.visa_category === cat)),
        );
      } else {
        setVisaOptions([]);
      }
      setLoadingVisas(false);
    }
    fetchVisaOptions();
  }, []);

  const handleTravelerInputChange = (field: string, value: string) => {
    setTravelers((prev) => {
      const updated = [...prev];
      updated[currentTraveler] = {
        ...updated[currentTraveler],
        [field]: value,
      };
      return updated;
    });
    if (field === "passportIssue" || field === "passportExpiry") {
      const issue =
        field === "passportIssue"
          ? value
          : travelers[currentTraveler].passportIssue;
      const expiry =
        field === "passportExpiry"
          ? value
          : travelers[currentTraveler].passportExpiry;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let dateError = "";
      if (issue && new Date(issue) > today) {
        dateError = "Passport issue date cannot be after today.";
      } else if (issue && expiry && new Date(issue) >= new Date(expiry)) {
        dateError = "Passport issue date must be before expiry date.";
      }
      setPassportDateError(dateError);
      // Validate expiry at least 181 days from today
      if (expiry) {
        const expiryDate = new Date(expiry);
        const diffDays =
          (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays < 181) {
          setPassportExpiryAlert(
            "Passport expiry date must be at least 181 days from today!",
          );
        } else {
          setPassportExpiryAlert("");
        }
      } else {
        setPassportExpiryAlert("");
      }
    }
    if (field === "dateOfBirth") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (value && new Date(value) > today) {
        setDateError("Date of birth cannot be after today.");
      } else {
        setDateError("");
      }
    }
    if (field === "departureDate" || field === "returnDate") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dep =
        field === "departureDate"
          ? value
          : travelers[currentTraveler].departureDate;
      const ret =
        field === "returnDate" ? value : travelers[currentTraveler].returnDate;
      let error = "";
      // Departure date must be at least tomorrow
      const tomorrow = addDays(today, 1);
      if (dep) {
        const depDate = new Date(dep);
        if (isBefore(depDate, tomorrow)) {
          error = "Departure date cannot be before tomorrow.";
        }
      }
      // Return date must be at least 1 day after departure date
      if (dep && ret) {
        const depDate = new Date(dep);
        const retDate = new Date(ret);
        if (!isAfter(retDate, depDate)) {
          error = "Return date must be at least 1 day after departure date.";
        }
      }
      setDateError(error);
    }
  };

  const handleImageUpload = async (field: string, file: File | null) => {
    if (!file) return;
    if (
      !["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(
        file.type,
      )
    ) {
      setUploadErrors((prev) => ({
        ...prev,
        [field]: "Only JPG, JPEG, PNG, PDF files are allowed.",
      }));
      setUploadPreviews((prev) => ({ ...prev, [field]: "" }));
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      setUploadErrors((prev) => ({
        ...prev,
        [field]: `Max file size is ${MAX_IMAGE_SIZE_MB}MB.`,
      }));
      setUploadPreviews((prev) => ({ ...prev, [field]: "" }));
      return;
    }
    setUploadErrors((prev) => ({ ...prev, [field]: "" }));
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadPreviews((prev) => ({
        ...prev,
        [field]: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
    const cid = customerId;
    if (!applicationId) {
      // AUTOMATED SAVE: Save application before first file upload
      const app = await saveApplication({ customer_id: cid });
      if (app && app.id) setApplicationId(app.id);
    }
    if (applicationId) {
      const filePath = `orders/${applicationId}/${field}-${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("visa-applications")
        .upload(filePath, file, { upsert: true });
      if (error && error.status === 403) {
        toast({
          title: "Access Denied",
          description:
            "You do not have permission to submit or update visa applications. Please contact support.",
          variant: "destructive",
        });
      }
      if (!error && data && data.path) {
        await supabase
          .from("visa_applications")
          .update({ [`${field}_url`]: data.path })
          .eq("id", applicationId);
      }
    }
  };

  const handleTravelerCountChange = (value: string) => {
    const count = Math.max(1, parseInt(value) || 1);
    setTravelerCount(count);
    setTravelers((prev) => {
      const arr = [...prev];
      while (arr.length < count) arr.push({ ...arr[0] });
      return arr.slice(0, count);
    });
    setCurrentTraveler(0);
  };

  const handleSameAsFirstChange = (checked: boolean) => {
    setSameAsFirst(checked);
    if (checked && currentTraveler > 0) {
      setTravelers((prev) => {
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
      setUploadPreviews((prev) => ({
        ...prev,
        flight: uploadPreviews.flight,
        makkahHotel: uploadPreviews.makkahHotel,
        madinahHotel: uploadPreviews.madinahHotel,
      }));
    }
  };

  const validateCurrentStep = () => {
    const errors: Record<string, boolean> = {};
    let hasError = false;
    if (currentStep === 1) {
      const t = travelers[currentTraveler];
      [
        "firstName",
        "lastName",
        "nationality",
        "gender",
        "passportNumber",
        "passportIssue",
        "passportExpiry",
        "dateOfBirth",
        "phone",
      ].forEach((f) => {
        if (!t[f]) {
          errors[f] = true;
          hasError = true;
        }
      });
      if (passportDateError || passportExpiryAlert || dateError)
        hasError = true;
    }
    if (currentStep === 2) {
      const t = travelers[currentTraveler];
      ["departureDate", "returnDate", "transportType"].forEach((f) => {
        if (!t[f]) {
          errors[f] = true;
          hasError = true;
        }
      });
      if (dateError) hasError = true;
    }
    if (currentStep === 3) {
      [
        "passportFront",
        "passportBack",
        "photo",
        "flight",
        "makkahHotel",
        "madinahHotel",
      ].forEach((f) => {
        if (!uploadPreviews[f]) {
          errors[f] = true;
          hasError = true;
        }
      });
      if (Object.values(uploadErrors).some(Boolean)) hasError = true;
    }
    setFieldErrors(errors);
    if (hasError) {
      toast({
        title: "Please fill all mandatory fields",
        description: "Some required fields are missing or invalid.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  // Add a helper to check if all required fields are filled
  const allRequiredFieldsFilled = () => {
    const t = travelers[currentTraveler];
    return (
      t.firstName &&
      t.lastName &&
      t.nationality &&
      t.passportNumber &&
      t.passportIssue &&
      t.passportExpiry &&
      t.dateOfBirth &&
      t.gender &&
      t.phone &&
      t.departureDate &&
      t.returnDate &&
      t.transportType &&
      visaType
    );
  };

  const nextStep = async () => {
    if (!validateCurrentStep()) return;

    let cid = customerId;
    // Only do this on the first step
    if (currentStep === 1) {
      const phone = travelers[currentTraveler].phone;
      cid = localStorage.getItem("customer_id");
      if (!cid && phone) {
        // Check DB for existing customer_id for this phone
        const { data, error } = await supabase
          .from("visa_applications")
          .select("customer_id")
          .eq("phone", phone)
          .limit(1)
          .single();
        if (error && error.status === 403) {
          toast({
            title: "Access Denied",
            description:
              "You do not have permission to access visa applications. Please contact support.",
            variant: "destructive",
          });
        }
        if (data && data.customer_id) {
          cid = data.customer_id;
        } else {
          cid = generateUUID();
        }
        localStorage.setItem("customer_id", cid);
      }
      setCustomerId(cid);
    }

    // Only save if all required fields are filled
    if (allRequiredFieldsFilled()) {
      // AUTOMATED SAVE: Save application after each valid step
      await saveApplication({ customer_id: cid });
    }
    if (currentStep < 4) setCurrentStep(currentStep + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get selected visa price from visaOptions
  const selectedVisa = visaOptions.find(
    (v) => v && v.visa_category && v.visa_category.toLowerCase() === visaType,
  );
  const selectedVisaPrice = selectedVisa ? selectedVisa.price : 0;
  const totalVisaPrice = selectedVisaPrice * travelerCount;

  // Add a helper to check if a file is a PDF
  const isPdf = (dataUrl: string) => dataUrl.startsWith("data:application/pdf");

  // Helper to upsert application data
  const saveApplication = async (extra: Record<string, unknown> = {}) => {
    if (savingRef.current) return;
    savingRef.current = true;
    const t = travelers[currentTraveler];
    const payload = {
      id: applicationId || undefined,
      customer_id: extra.customer_id || customerId,
      first_name: t.firstName,
      last_name: t.lastName,
      nationality: t.nationality,
      passport_number: t.passportNumber,
      passport_issue: t.passportIssue,
      passport_expiry: t.passportExpiry,
      date_of_birth: t.dateOfBirth,
      gender: t.gender,
      email: t.email,
      phone: t.phone,
      departure_date: t.departureDate,
      return_date: t.returnDate,
      transport_type: t.transportType,
      visa_type: visaType,
      status: "pending",
      ...extra,
    };
    let data, error;
    if (payload.id) {
      ({ data, error } = await supabase
        .from("visa_applications")
        .upsert([payload], { onConflict: "id" })
        .single());
    } else {
      ({ data, error } = await supabase
        .from("visa_applications")
        .insert([payload])
        .single());
    }
    if (error && error.status === 403) {
      toast({
        title: "Access Denied",
        description:
          "You do not have permission to submit or update visa applications. Please contact support.",
        variant: "destructive",
      });
    }
    if (data && data.id) setApplicationId(data.id);
    savingRef.current = false;
    return data;
  };

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment</h3>

      <Card className="bg-emerald-50 border-emerald-200">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-emerald-800 mb-4">
            Application Summary
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Visa Type:</span>
              <span className="font-semibold capitalize">{visaType}</span>
            </div>
            <div className="flex justify-between">
              <span>Visa Fee per Traveler:</span>
              <span className="font-semibold">
                ₹{selectedVisaPrice?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Number of Travelers:</span>
              <span className="font-semibold">{travelerCount}</span>
            </div>
            <hr className="my-2 border-emerald-300" />
            <div className="flex justify-between text-lg font-bold text-emerald-800">
              <span>Total Visa Amount:</span>
              <span>₹{totalVisaPrice?.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <UmrahVisaPayment
          visaType={visaType}
          amount={totalVisaPrice}
          processingTime={
            visaOptions.find(
              (v) =>
                v &&
                v.visa_category &&
                v.visa_category.toLowerCase() === visaType,
            )?.processing_time || ""
          }
          visaApplicationId={applicationId}
          onProceedToPayment={async () => {
            // Generate customer/application ID if needed
            let cid = customerId;
            if (!cid) {
              cid = generateUUID();
              setCustomerId(cid);
              localStorage.setItem("customer_id", cid);
            }
            
            // Build full payload for the current traveler
            const t = travelers[currentTraveler];
            const payload = {
              id: applicationId || undefined,
              customer_id: cid,
              first_name: t.firstName,
              last_name: t.lastName,
              nationality: t.nationality,
              passport_number: t.passportNumber,
              passport_issue: t.passportIssue,
              passport_expiry: t.passportExpiry,
              date_of_birth: t.dateOfBirth,
              gender: t.gender,
              email: t.email,
              phone: t.phone,
              departure_date: t.departureDate,
              return_date: t.returnDate,
              transport_type: t.transportType,
              visa_type: visaType,
              status: "pending",
            };
            
            try {
              const data = await saveApplication(payload);
              if (data && data.id) {
                setApplicationId(data.id);
                return data.id;
              }
              throw new Error("Failed to create visa application");
            } catch (error) {
              console.error("Error saving application:", error);
              throw error;
            }
          }}
          onPaymentSuccess={() => {
            toast({
              title: "Payment Successful!",
              description: "Your visa application has been submitted and payment completed successfully. You will receive a confirmation email shortly.",
            });
            // Optionally redirect or show success state
          }}
        />
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
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Select Umrah Visa Type
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {loadingVisas ? (
                  <div className="col-span-3 text-center py-8">
                    Loading visa options...
                  </div>
                ) : (
                  visaOptions.map((visa, idx) =>
                    visa ? (
                      <div
                        key={visa.visa_category}
                        className={`text-center p-2 border rounded cursor-pointer transition-all ${visaType === visa.visa_category.toLowerCase() ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-400" : ""}`}
                        onClick={() =>
                          setVisaType(visa.visa_category.toLowerCase())
                        }
                      >
                        <Badge
                          className={`mb-1 text-xs px-2 py-1 rounded ${visa.visa_category === "Standard" ? "bg-blue-100 text-blue-800" : visa.visa_category === "Premium" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}
                        >
                          {visa.visa_category}
                        </Badge>
                        <h3 className="font-semibold text-xs mb-1">
                          {visa.processing_time}
                        </h3>
                        <p className="text-xl font-bold text-emerald-600">
                          ₹{visa.price?.toLocaleString()}
                        </p>
                        <div className="text-sm mt-1">
                          Approval Rate:{" "}
                          <span className="font-semibold">
                            {visa.approval_rate !== undefined &&
                            visa.approval_rate !== null
                              ? `${visa.approval_rate}%`
                              : "Coming Soon"}
                          </span>
                        </div>
                      </div>
                    ) : null,
                  )
                )}
              </div>
            </Card>

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        currentStep >= step.number
                          ? "bg-emerald-600 border-emerald-600 text-white"
                          : "border-gray-300 text-gray-400"
                      }`}
                    >
                      <step.icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`ml-2 text-sm font-medium hidden md:block ${
                        currentStep >= step.number
                          ? "text-emerald-600"
                          : "text-gray-400"
                      }`}
                    >
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
                  <label className="block text-lg font-semibold text-gray-900">
                    Number of Travelers / Visas Required
                  </label>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() =>
                      handleTravelerCountChange(
                        String(Math.max(1, travelerCount - 1)),
                      )
                    }
                    disabled={travelerCount <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-xl font-bold w-8 text-center">
                    {travelerCount}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                    onClick={() =>
                      handleTravelerCountChange(String(travelerCount + 1))
                    }
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mb-4">
                  <Badge className="bg-emerald-100 text-emerald-800">
                    Traveler {currentTraveler + 1} of {travelerCount}
                  </Badge>
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
                    <p className="text-sm text-gray-600 mt-2">
                      Please add details for all travelers before proceeding to
                      payment.
                    </p>
                  </div>
                ) : null}
                {currentStep === 4 &&
                  currentTraveler === travelerCount - 1 &&
                  renderStep4()}

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
