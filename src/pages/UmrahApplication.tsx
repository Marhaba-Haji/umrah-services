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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface VisaOption {
  visa_category?: string;
  processing_time?: string;
  price?: number;
  approval_rate?: number;
}

function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const UmrahApplication = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [travelerCount, setTravelerCount] = useState(1);
  const [currentTraveler, setCurrentTraveler] = useState(0);
  const [travelers, setTravelers] = useState([
    {
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
      departureDate: "",
      returnDate: "",
      departureCity: "",
      hotelMakkah: "",
      hotelMadinah: "",
      transportType: "",
    },
  ]);
  const [passportDateError, setPassportDateError] = useState("");
  const [passportExpiryAlert, setPassportExpiryAlert] = useState("");
  const [dateError, setDateError] = useState("");
  const MAX_IMAGE_SIZE_MB = 2;
  const [uploadedFiles, setUploadedFiles] = useState({
    passportFront: null as File | null,
    passportBack: null as File | null,
    photo: null as File | null,
    flight: null as File | null,
    makkahHotel: null as File | null,
    madinahHotel: null as File | null,
  });
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

  // Sort nationalityOptions alphabetically, but keep India on top
  const baseNationalities = [
    // Europe
    "Albania",
    "Andorra",
    "Armenia",
    "Austria",
    "Azerbaijan",
    "Belarus",
    "Belgium",
    "Bosnia and Herzegovina",
    "Bulgaria",
    "Croatia",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Georgia",
    "Germany",
    "Greece",
    "Hungary",
    "Iceland",
    "Ireland",
    "Italy",
    "Kazakhstan",
    "Kosovo",
    "Latvia",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Moldova",
    "Monaco",
    "Montenegro",
    "Netherlands",
    "North Macedonia",
    "Norway",
    "Poland",
    "Portugal",
    "Romania",
    "Russia",
    "San Marino",
    "Serbia",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Sweden",
    "Switzerland",
    "Turkey",
    "Ukraine",
    "United Kingdom",
    // Americas
    "Antigua and Barbuda",
    "Argentina",
    "Bahamas",
    "Barbados",
    "Belize",
    "Bolivia",
    "Brazil",
    "Canada",
    "Chile",
    "Colombia",
    "Costa Rica",
    "Cuba",
    "Dominica",
    "Dominican Republic",
    "Ecuador",
    "El Salvador",
    "Grenada",
    "Guatemala",
    "Guyana",
    "Haiti",
    "Honduras",
    "Jamaica",
    "Mexico",
    "Nicaragua",
    "Panama",
    "Paraguay",
    "Peru",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Vincent and the Grenadines",
    "Suriname",
    "Trinidad and Tobago",
    "United States",
    "Uruguay",
    "Venezuela",
    // Asia (special)
    "Indonesia",
    "Malaysia",
    "Turkey",
    "Pakistan",
    "Bangladesh",
  ];
  const sortedNationalities = baseNationalities
    .filter((n) => n !== "India")
    .sort();
  const nationalityOptions = ["India", ...sortedNationalities];

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Personal Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <Input
            type="text"
            value={travelers[currentTraveler].firstName}
            onChange={(e) =>
              handleTravelerInputChange("firstName", e.target.value)
            }
            className={fieldErrors.firstName ? "border-red-500" : ""}
            placeholder="Enter first name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <Input
            type="text"
            value={travelers[currentTraveler].lastName}
            onChange={(e) =>
              handleTravelerInputChange("lastName", e.target.value)
            }
            className={fieldErrors.lastName ? "border-red-500" : ""}
            placeholder="Enter last name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nationality *
          </label>
          <Select
            value={travelers[currentTraveler].nationality || "India"}
            onValueChange={(value) =>
              handleTravelerInputChange("nationality", value)
            }
          >
            <SelectTrigger
              className={fieldErrors.nationality ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Select nationality" />
            </SelectTrigger>
            <SelectContent>
              {nationalityOptions.map((nat, idx) => (
                <SelectItem key={nat + idx} value={nat}>
                  {nat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <Select
            value={travelers[currentTraveler].gender}
            onValueChange={(value) =>
              handleTravelerInputChange("gender", value)
            }
          >
            <SelectTrigger
              className={fieldErrors.gender ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passport Number *
          </label>
          <Input
            type="text"
            value={travelers[currentTraveler].passportNumber}
            onChange={(e) =>
              handleTravelerInputChange("passportNumber", e.target.value)
            }
            className={fieldErrors.passportNumber ? "border-red-500" : ""}
            placeholder="Enter passport number"
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth *
          </label>
          <DatePicker
            selected={
              travelers[currentTraveler].dateOfBirth
                ? new Date(travelers[currentTraveler].dateOfBirth)
                : null
            }
            onChange={(date) =>
              handleTravelerInputChange(
                "dateOfBirth",
                date ? date.toISOString().split("T")[0] : "",
              )
            }
            className={`w-full h-10 ${fieldErrors.dateOfBirth ? "border-red-500" : ""}`}
            maxDate={yesterday}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            placeholderText="Select date of birth"
            dateFormat="yyyy-MM-dd"
            customInput={
              <Input
                className={`w-full h-10 ${fieldErrors.dateOfBirth ? "border-red-500" : ""}`}
              />
            }
          />
          {dateError && (
            <p className="text-sm text-red-500 mt-1">{dateError}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passport Issue Date *
          </label>
          <DatePicker
            selected={
              travelers[currentTraveler].passportIssue
                ? new Date(travelers[currentTraveler].passportIssue)
                : null
            }
            onChange={(date) =>
              handleTravelerInputChange(
                "passportIssue",
                date ? date.toISOString().split("T")[0] : "",
              )
            }
            className={`w-full h-10 ${fieldErrors.passportIssue ? "border-red-500" : ""}`}
            maxDate={today}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            placeholderText="Select passport issue date"
            dateFormat="yyyy-MM-dd"
            customInput={
              <Input
                className={`w-full h-10 ${fieldErrors.passportIssue ? "border-red-500" : ""}`}
              />
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Passport Expiry Date *
          </label>
          <DatePicker
            selected={
              travelers[currentTraveler].passportExpiry
                ? new Date(travelers[currentTraveler].passportExpiry)
                : null
            }
            onChange={(date) =>
              handleTravelerInputChange(
                "passportExpiry",
                date ? date.toISOString().split("T")[0] : "",
              )
            }
            className={`w-full h-10 ${fieldErrors.passportExpiry ? "border-red-500" : ""}`}
            minDate={minExpiry}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            placeholderText="Select passport expiry date"
            dateFormat="yyyy-MM-dd"
            customInput={
              <Input
                className={`w-full h-10 ${fieldErrors.passportExpiry ? "border-red-500" : ""}`}
              />
            }
          />
          {passportExpiryAlert && (
            <p className="text-sm text-red-500 mt-1">{passportExpiryAlert}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <Input
            type="tel"
            value={travelers[currentTraveler].phone}
            onChange={(e) => handleTravelerInputChange("phone", e.target.value)}
            className={fieldErrors.phone ? "border-red-500" : ""}
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <Input
            type="email"
            value={travelers[currentTraveler].email}
            onChange={(e) => handleTravelerInputChange("email", e.target.value)}
            placeholder="Enter email address"
          />
        </div>
      </div>

      {passportDateError && (
        <p className="text-sm text-red-500">{passportDateError}</p>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Travel Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Departure Date *
          </label>
          <DatePicker
            selected={
              travelers[currentTraveler].departureDate
                ? new Date(travelers[currentTraveler].departureDate)
                : null
            }
            onChange={(date) =>
              handleTravelerInputChange(
                "departureDate",
                date ? date.toISOString().split("T")[0] : "",
              )
            }
            className={`w-full h-10 ${fieldErrors.departureDate ? "border-red-500" : ""}`}
            minDate={tomorrow}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            placeholderText="Select departure date"
            dateFormat="yyyy-MM-dd"
            customInput={
              <Input
                className={`w-full h-10 ${fieldErrors.departureDate ? "border-red-500" : ""}`}
              />
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Return Date *
          </label>
          <DatePicker
            selected={
              travelers[currentTraveler].returnDate
                ? new Date(travelers[currentTraveler].returnDate)
                : null
            }
            onChange={(date) =>
              handleTravelerInputChange(
                "returnDate",
                date ? date.toISOString().split("T")[0] : "",
              )
            }
            className={`w-full h-10 ${fieldErrors.returnDate ? "border-red-500" : ""}`}
            minDate={
              travelers[currentTraveler].departureDate
                ? new Date(travelers[currentTraveler].departureDate)
                : tomorrow
            }
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            placeholderText="Select return date"
            dateFormat="yyyy-MM-dd"
            customInput={
              <Input
                className={`w-full h-10 ${fieldErrors.returnDate ? "border-red-500" : ""}`}
              />
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Transport Type *{" "}
            <span className="text-xs text-gray-500">(charged extra*)</span>
          </label>
          <Select
            value={travelers[currentTraveler].transportType}
            onValueChange={(value) =>
              handleTravelerInputChange("transportType", value)
            }
          >
            <SelectTrigger
              className={fieldErrors.transportType ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Select transport type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedan">Sedan (3 pax)</SelectItem>
              <SelectItem value="h1">H1 (5 pax)</SelectItem>
              <SelectItem value="gmc">GMC (7 pax)</SelectItem>
              <SelectItem value="hiace">Hiace (10 pax)</SelectItem>
              <SelectItem value="coaster">Coaster (20 pax)</SelectItem>
              <SelectItem value="haramain-train">Haramain Train</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {dateError && <p className="text-sm text-red-500">{dateError}</p>}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Document Upload
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { key: "passportFront", label: "Passport Front Page *" },
          { key: "passportBack", label: "Passport Back Page *" },
          { key: "photo", label: "Passport Size Photo *" },
          { key: "flight", label: "Flight Booking *" },
          { key: "makkahHotel", label: "Makkah Hotel Booking *" },
          { key: "madinahHotel", label: "Madinah Hotel Booking *" },
        ].map(({ key, label }) => (
          <div key={key} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {label}
            </label>
            <Input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) =>
                handleImageUpload(key, e.target.files?.[0] || null)
              }
              className={fieldErrors[key] ? "border-red-500" : ""}
            />
            {uploadErrors[key] && (
              <p className="text-sm text-red-500">{uploadErrors[key]}</p>
            )}
            {uploadPreviews[key] && (
              <div className="mt-2">
                {isPdf(uploadPreviews[key]) ? (
                  <p className="text-sm text-green-600">
                    PDF uploaded successfully
                  </p>
                ) : (
                  <img
                    src={uploadPreviews[key]}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded border"
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

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
            try {
              let cid = customerId;
              if (!cid) {
                cid = generateUUID();
                setCustomerId(cid);
                localStorage.setItem("customer_id", cid);
              }

              const t = travelers[currentTraveler];

              // Upload files first
              const fileUrls = await uploadAllFiles();

              const payload = {
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
                ...fileUrls, // Add file URLs
              };

              if (applicationId) {
                // Update existing application
                const { data, error } = await supabase
                  .from("visa_applications")
                  .update(payload)
                  .eq("id", applicationId)
                  .select()
                  .single();

                if (error) throw error;
                return applicationId;
              } else {
                // Create new application
                const { data, error } = await supabase
                  .from("visa_applications")
                  .insert([payload])
                  .select()
                  .single();

                if (error) throw error;
                if (data && data.id) {
                  setApplicationId(data.id);
                  return data.id;
                }
              }
              throw new Error("Failed to create visa application");
            } catch (error: unknown) {
              console.error("Error saving application:", error);
              throw error;
            }
          }}
          onPaymentSuccess={() => {
            // This should only be called after actual payment success from PayU
            toast({
              title: "Payment Successful!",
              description:
                "Your visa application has been submitted and payment completed successfully. You will receive a confirmation email shortly.",
            });
          }}
        />
      </div>
    </div>
  );

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
        const order = ["Standard", "Premium", "Express"];
        setVisaOptions(
          order
            .map((cat) => data.find((v) => v.visa_category === cat))
            .filter(Boolean),
        );
      } else {
        setVisaOptions([]);
      }
      setLoadingVisas(false);
    }
    fetchVisaOptions();
  }, []);

  const uploadAllFiles = async () => {
    const fileUrls: Record<string, string> = {};

    for (const [key, file] of Object.entries(uploadedFiles)) {
      if (file) {
        try {
          const fileName = `${customerId}_${Date.now()}_${key}.${file.name.split(".").pop()}`;
          const { data, error } = await supabase.storage
            .from("visa-applications")
            .upload(fileName, file);

          if (error) {
            console.error(`Error uploading ${key}:`, error);
            throw new Error(`Failed to upload ${key}`);
          }

          // Get public URL
          const { data: urlData } = supabase.storage
            .from("visa-applications")
            .getPublicUrl(fileName);

          // Map to database column names
          const columnMap: Record<string, string> = {
            passportFront: "passport_front_url",
            passportBack: "passport_back_url",
            photo: "photo_url",
            flight: "flight_url",
            makkahHotel: "makkah_hotel_url",
            madinahHotel: "madinah_hotel_url",
          };

          fileUrls[columnMap[key]] = urlData.publicUrl;
        } catch (error) {
          console.error(`Error processing ${key}:`, error);
          throw error;
        }
      }
    }

    return fileUrls;
  };

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
      if (expiry) {
        const expiryDate = new Date(expiry);
        const minExpiry = new Date(today);
        minExpiry.setDate(today.getDate() + 181);
        const diffDays =
          (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
        if (expiryDate < minExpiry) {
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
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      if (value && new Date(value) >= today) {
        setDateError("Date of birth must be at least 1 day before today.");
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
      const tomorrow = addDays(today, 1);
      if (dep) {
        const depDate = new Date(dep);
        if (isBefore(depDate, tomorrow)) {
          error = "Departure date cannot be before tomorrow.";
        }
      }
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

    // Store the actual file
    setUploadedFiles((prev) => ({
      ...prev,
      [field]: file,
    }));

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadPreviews((prev) => ({
        ...prev,
        [field]: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);
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

  const validateCurrentStep = () => {
    const errors: Record<string, boolean> = {};
    let hasError = false;

    if (currentStep === 1) {
      const t = travelers[currentTraveler];
      [
        "firstName",
        "lastName",
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
      if (!t.nationality) {
        travelers[currentTraveler].nationality = "India";
      }
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
        if (!uploadedFiles[f]) {
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
    if (currentStep === 1) {
      const phone = travelers[currentTraveler].phone;
      cid = localStorage.getItem("customer_id");
      if (!cid && phone) {
        try {
          const { data, error } = await supabase
            .from("visa_applications")
            .select("customer_id")
            .eq("phone", phone)
            .limit(1)
            .maybeSingle();

          if (error && error.code !== "PGRST116") {
            console.error("Error fetching customer:", error);
          }

          if (data && data.customer_id) {
            cid = data.customer_id;
          } else {
            cid = generateUUID();
          }
          localStorage.setItem("customer_id", cid);
        } catch (error) {
          console.error("Error with customer lookup:", error);
          cid = generateUUID();
          localStorage.setItem("customer_id", cid);
        }
      }
      setCustomerId(cid);
    }

    if (currentStep < 4) setCurrentStep(currentStep + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectedVisa = visaOptions.find(
    (v) => v && v.visa_category && v.visa_category.toLowerCase() === visaType,
  );
  const selectedVisaPrice = selectedVisa ? selectedVisa.price : 0;
  const totalVisaPrice = selectedVisaPrice * travelerCount;

  const isPdf = (dataUrl: string) => dataUrl.startsWith("data:application/pdf");

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const minExpiry = new Date(today);
  minExpiry.setDate(today.getDate() + 181);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <UmrahApplicationSidebar />
            </div>
          </div>

          <div className="lg:col-span-3">
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

      <FAQSection />
      <Footer />
    </div>
  );
};

export default UmrahApplication;
