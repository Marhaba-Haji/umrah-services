import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  FileText,
  Clock,
  CheckCircle,
  Users,
  Briefcase,
  Plane,
  GraduationCap,
  Heart,
  Shield,
  Award,
  Info,
  Star,
  MessageCircle,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useCurrency } from "../components/Header";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "../integrations/supabase/types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import WhatsAppWidget from "../components/WhatsAppWidget";

interface VisaType {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  processingTime: string;
  validity: string;
  price: number;
  requirements: string[];
  features: string[];
  color: string;
  category: string;
  eligibility?: string;
  process?: string;
  approval_rate?: number;
  visa_format?: string;
  stay_validity?: string;
  total_stay_allowed?: number;
}

// --- VisaCard component ---
function VisaCard({
  visa,
  expanded,
  toggleDesc,
  toggleProc,
  toggleDocs,
  onApply,
}) {
  // Remove icon/color logic
  const requirementsArr = Array.isArray(visa.requirements)
    ? visa.requirements
    : typeof visa.requirements === "string"
      ? JSON.parse(visa.requirements) ||
        visa.requirements.split(",").map((f) => f.trim())
      : [];
  const imageUrl = visa.featured_image || "/default-visa.jpg";

  return (
    <Card className="relative group shadow-xl rounded-3xl border-0 bg-white mb-6 overflow-hidden">
      {/* Image section with overlay */}
      <div className="relative">
        <img
          src={imageUrl}
          alt={visa.visa_type}
          className="w-full h-36 object-cover rounded-t-2xl"
        />
        {/* Top-left badges for visa format and approval rate */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {visa.visa_format && (
            <span className="bg-blue-600 text-white px-2 py-0.5 rounded-full text-xs shadow">
              {visa.visa_format}
            </span>
          )}
          {typeof visa.approval_rate === "number" && (
            <span className="bg-green-600 text-white px-2 py-0.5 rounded-full text-xs font-semibold shadow">
              {visa.approval_rate}% Approval
            </span>
          )}
        </div>
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-2 rounded-t-2xl flex justify-between items-end">
          <div>
            <h3 className="text-base font-bold text-white drop-shadow mb-0.5">
              {visa.visa_type}
            </h3>
          </div>
          <div>
            <span className="bg-white text-green-700 font-bold px-3 py-1 pr-6 rounded-full shadow text-base relative">
              ₹{Number(visa.agency_fees ?? visa.price).toLocaleString()}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer flex items-center justify-center">
                      <Info className="w-4 h-4 text-blue-500" />
                    </span>
                  </TooltipTrigger>
                  <TooltipContent className="bg-white text-gray-900 shadow-lg rounded-lg p-3 text-sm min-w-[180px]">
                    <div>
                      <span className="font-semibold">Agency Fees:</span> ₹
                      {visa.agency_fees
                        ? Number(visa.agency_fees).toLocaleString()
                        : "-"}
                    </div>
                    <div>
                      <span className="font-semibold">Embassy Fees:</span> ₹
                      {visa.embassy_fees
                        ? Number(visa.embassy_fees).toLocaleString()
                        : "-"}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
          </div>
        </div>
      </div>
      {/* Card content below image */}
      <div className="p-4 flex flex-col gap-2">
        {/* Chips for details */}
        <div className="flex flex-wrap gap-1 mt-1 mb-1 justify-center">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium text-xs shadow-sm">
            <Clock className="w-4 h-4" />
            Processing:{" "}
            <span className="font-semibold ml-1">{visa.processing_time}</span>
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium text-xs shadow-sm">
            <FileText className="w-4 h-4" />
            Validity:{" "}
            <span className="font-semibold ml-1">{visa.visa_validity}</span>
          </span>
          {visa.stay_validity && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 font-medium text-xs shadow-sm">
              <Award className="w-4 h-4" />
              Stay:{" "}
              <span className="font-semibold ml-1">{visa.stay_validity}</span>
            </span>
          )}
          {visa.total_stay_allowed && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-medium text-xs shadow-sm">
              <Award className="w-4 h-4" />
              Total Stay:{" "}
              <span className="font-semibold ml-1">
                {visa.total_stay_allowed} days
              </span>
            </span>
          )}
        </div>
        {/* Accordion for more info */}
        <Accordion type="multiple" className="w-full mt-1 space-y-1">
          <AccordionItem value="docs" className="!mt-0 !mb-0">
            <AccordionTrigger className="py-1 min-h-0 text-sm">
              Required Documents
            </AccordionTrigger>
            <AccordionContent className="pt-2 pb-3">
              <ul className="text-sm text-gray-700 space-y-1">
                {requirementsArr.map((req, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {req}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
          {visa.description && (
            <AccordionItem value="desc" className="!mt-0 !mb-0">
              <AccordionTrigger className="py-1 min-h-0 text-sm">
                Description
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-3">
                {/* Parse description HTML for heading and list, else fallback to styled prose card */}
                {(() => {
                  try {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(
                      visa.description,
                      "text/html",
                    );
                    const heading = doc.querySelector(
                      "strong, b, h1, h2, h3, h4, h5, h6",
                    );
                    const list = doc.querySelector("ul, ol");
                    const paragraphs = Array.from(
                      doc.querySelectorAll("p"),
                    ).filter((p) => !p.contains(heading) && !p.contains(list));
                    if (heading && list) {
                      return (
                        <div className="bg-blue-50 rounded-xl p-4 shadow-sm">
                          <div className="mb-2 flex items-center gap-2">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                              Important
                            </span>
                            <h4 className="text-lg font-bold text-blue-800 m-0">
                              {heading.textContent}
                            </h4>
                          </div>
                          {paragraphs.length > 0 && (
                            <p className="text-gray-700 mb-2">
                              {paragraphs[0].textContent}
                            </p>
                          )}
                          <ul className="list-none pl-0 space-y-2">
                            {Array.from(list.children).map((li, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="mt-1 text-red-500">⚠️</span>
                                <span>{li.textContent}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                  } catch (err) {
                    console.error("Visa description parse error:", err);
                  }
                  // Fallback: styled prose card
                  return (
                    <div className="bg-blue-50 rounded-xl p-4 shadow-sm prose prose-sm max-w-none">
                      <div
                        dangerouslySetInnerHTML={{ __html: visa.description }}
                      />
                    </div>
                  );
                })()}
              </AccordionContent>
            </AccordionItem>
          )}
          {visa.process && (
            <AccordionItem value="proc" className="!mt-0 !mb-0">
              <AccordionTrigger className="py-1 min-h-0 text-sm">
                Process
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-3">
                {/* Parse process HTML into steps with debug log and static fallback */}
                {(() => {
                  try {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(
                      visa.process,
                      "text/html",
                    );
                    const nodes = Array.from(doc.body.childNodes);
                    const steps = [];
                    let currentStep = null;
                    nodes.forEach((node) => {
                      if (
                        node.nodeType === 1 &&
                        ((node as Element).tagName === "P" ||
                          (node as Element).tagName === "DIV")
                      ) {
                        const strong = (node as Element).querySelector(
                          "strong, b",
                        );
                        if (strong) {
                          if (currentStep) steps.push(currentStep);
                          currentStep = {
                            title: strong.textContent,
                            desc: node.textContent
                              .replace(strong.textContent, "")
                              .replace(/^-?\s*/, ""),
                          };
                        } else if (currentStep) {
                          currentStep.desc += " " + node.textContent;
                        }
                      }
                    });
                    if (currentStep) steps.push(currentStep);
                    if (steps.length === 0) throw new Error("No steps");
                    // Debug log
                    console.log("Parsed process steps:", steps);
                    // Render timeline
                    return (
                      <ol className="relative border-l-2 border-green-200 pl-10 pr-2">
                        {steps.map((step, idx) => (
                          <li key={idx} className="mb-8 ml-6 flex items-start">
                            <span
                              className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full text-white font-bold ${["bg-green-500", "bg-blue-500", "bg-yellow-500", "bg-purple-500"][idx % 4]}`}
                            >
                              {idx + 1}
                            </span>
                            <div>
                              <h4
                                className={`font-bold ${["text-green-700", "text-blue-700", "text-yellow-700", "text-purple-700"][idx % 4]}`}
                              >
                                {step.title}
                              </h4>
                              <p className="text-gray-700 text-sm">
                                {step.desc}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    );
                  } catch {
                    // no-op: fallback handled below
                    return null;
                  }
                  // Fallback: show a static sample timeline
                  console.warn(
                    "Process parsing failed, showing sample timeline:",
                  );
                  return (
                    <ol className="relative border-l-2 border-green-200">
                      <li className="mb-8 ml-6 flex items-start">
                        <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-green-500 rounded-full text-white font-bold">
                          1
                        </span>
                        <div>
                          <h4 className="font-bold text-green-700">
                            Start &amp; submit your application
                          </h4>
                          <p className="text-gray-700 text-sm">
                            Complete your application accurately on our
                            user-friendly platform.
                          </p>
                        </div>
                      </li>
                      <li className="mb-8 ml-6 flex items-start">
                        <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full text-white font-bold">
                          2
                        </span>
                        <div>
                          <h4 className="font-bold text-blue-700">
                            Expert review and appointment booking
                          </h4>
                          <p className="text-gray-700 text-sm">
                            Your designated visa expert reviews your application
                            and books your appointments at the visa centre.
                          </p>
                        </div>
                      </li>
                      <li className="mb-8 ml-6 flex items-start">
                        <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-yellow-500 rounded-full text-white font-bold">
                          3
                        </span>
                        <div>
                          <h4 className="font-bold text-yellow-700">
                            Visit visa application centre
                          </h4>
                          <p className="text-gray-700 text-sm">
                            Visit the visa centre to submit biometrics with our
                            guidance and support.
                          </p>
                        </div>
                      </li>
                      <li className="ml-6 flex items-start">
                        <span className="absolute -left-3 flex items-center justify-center w-6 h-6 bg-purple-500 rounded-full text-white font-bold">
                          4
                        </span>
                        <div>
                          <h4 className="font-bold text-purple-700">
                            Visa delivered on time
                          </h4>
                          <p className="text-gray-700 text-sm">
                            Relax as we ensure your visa is processed promptly
                            and delivered on time.
                          </p>
                        </div>
                      </li>
                    </ol>
                  );
                })()}
              </AccordionContent>
            </AccordionItem>
          )}
          {visa.eligibility && (
            <AccordionItem value="elig" className="!mt-0 !mb-0">
              <AccordionTrigger className="py-1 min-h-0 text-sm">
                Eligibility
              </AccordionTrigger>
              <AccordionContent className="pt-2 pb-3">
                <div
                  className="prose prose-sm"
                  dangerouslySetInnerHTML={{ __html: visa.eligibility }}
                />
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
        {/* Checklist link */}
        {visa.checklist_url && (
          <a
            href={visa.checklist_url}
            target="_blank"
            rel="noopener"
            className="block text-center text-blue-600 underline text-xs mt-2"
          >
            <FileText className="w-4 h-4 inline" /> Download Checklist
          </a>
        )}
        {/* Sticky CTA */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full text-lg font-bold bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg rounded-xl hover:bg-green-600 transition mt-4 sticky bottom-0 z-40">
              Apply Now
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg w-full rounded-2xl p-0 overflow-hidden">
            <ApplicationModal visa={visa} />
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  );
}

// --- ApplicationModal component (3-step flow, progress bar, trust signals) ---
function ApplicationModal({ visa }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (submitted) {
    return (
      <div className="w-full text-center p-8">
        <div className="text-green-600 text-4xl mb-4">✔️</div>
        <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
        <p className="mb-4 text-gray-700">
          Thank you for applying. Our team will contact you within 24 hours. For
          urgent queries, reach us on WhatsApp.
        </p>
        <a
          href="https://wa.me/919008447887"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 text-green-600 underline font-semibold"
        >
          <MessageCircle className="w-5 h-5" /> WhatsApp Support
        </a>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${step >= s ? "bg-green-600" : "bg-gray-300"}`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`h-1 w-full ${step > s ? "bg-green-600" : "bg-gray-200"}`}
              />
            )}
          </div>
        ))}
      </div>
      <div className="px-6 pb-6 pt-2">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold mb-2">Your Details</h2>
            <Input
              className="mb-2"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            <Input
              className="mb-2"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
            />
            <Input
              className="mb-2"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
            />
            {error && <div className="text-red-600 text-xs mb-2">{error}</div>}
            <Button
              className="w-full mt-4 bg-green-600 text-white"
              onClick={() => {
                if (!form.name || !form.email || !form.phone) {
                  setError("Please fill all fields");
                  return;
                }
                setError("");
                setStep(2);
              }}
            >
              Next
            </Button>
          </div>
        )}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold mb-2">Upload Documents</h2>
            <ul className="mb-2 text-sm text-gray-700">
              {Array.isArray(visa.requirements) &&
                visa.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    {req}
                  </li>
                ))}
            </ul>
            <Input className="mb-2" type="file" multiple />
            <Button
              className="w-full mt-4 bg-green-600 text-white"
              onClick={() => setStep(3)}
            >
              Next
            </Button>
          </div>
        )}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold mb-2">Payment</h2>
            <div className="mb-2 text-lg font-semibold">
              Total: ₹{Number(visa.agency_fees ?? visa.price).toLocaleString()}
            </div>
            {visa.embassy_fees && (
              <div className="mb-2 text-sm text-gray-500">
                + Embassy Fee: ₹{Number(visa.embassy_fees).toLocaleString()}
              </div>
            )}
            <Button
              className="w-full mt-4 bg-gradient-to-r from-green-500 to-blue-500 text-white"
              onClick={() => setSubmitted(true)}
            >
              Pay Securely
            </Button>
            <div className="mt-4 text-xs text-gray-500 text-center">
              100% Secure Payment • Money-back Guarantee • 24/7 Support
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const OtherSaudiVisas = () => {
  const { currency } = useCurrency();
  const [selectedVisa, setSelectedVisa] = useState<VisaType | null>(null);
  const [applicationDate, setApplicationDate] = useState<Date>();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [umrahVisas, setUmrahVisas] = useState<
    Database["public"]["Tables"]["saudi_visas"]["Row"][]
  >([]);
  const [umrahLoading, setUmrahLoading] = useState(true);
  const [otherVisas, setOtherVisas] = useState<
    Database["public"]["Tables"]["saudi_visas"]["Row"][]
  >([]);
  const [otherVisasLoading, setOtherVisasLoading] = useState(true);
  const [expanded, setExpanded] = useState<{
    [id: string]: { desc: boolean; proc: boolean };
  }>({});

  // Always use INR for all prices/fees
  const currencySymbol = "₹";

  const [applicationForm, setApplicationForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "",
    passportNumber: "",
    dateOfBirth: "",
    purpose: "",
    duration: "",
    specialRequests: "",
  });

  const visaTypes: VisaType[] = [
    {
      id: "family-visit",
      name: "Family Visit Visa",
      icon: Heart,
      description: "Visit your family members residing in Saudi Arabia",
      processingTime: "5-7 business days",
      validity: "90 days",
      price: 199,
      color: "rose",
      category: "Personal",
      requirements: [
        "Valid passport (6+ months validity)",
        "Family invitation letter with attestation",
        "Sponsor employment certificate",
        "Family relationship proof documents",
        "Accommodation details and address",
        "Sponsor salary certificate",
        "Medical insurance coverage",
      ],
      features: [
        "Multiple entry options available",
        "Extendable validity period",
        "Family reunion purposes",
        "Renewable under conditions",
      ],
    },
    {
      id: "tourist",
      name: "Tourist Visa",
      icon: Plane,
      description: "Explore Saudi Arabia's heritage and modern attractions",
      processingTime: "3-5 business days",
      validity: "1 year",
      price: 149,
      color: "blue",
      category: "Tourism",
      requirements: [
        "Valid passport (6+ months validity)",
        "Detailed travel itinerary",
        "Hotel bookings confirmation",
        "Return flight tickets",
        "Travel insurance policy",
        "Bank statements (3 months)",
        "Employment certificate",
      ],
      features: [
        "Multiple entry permitted",
        "Tourism activities allowed",
        "Online application process",
        "90 days per visit maximum",
      ],
    },
    {
      id: "business",
      name: "Business Visa",
      icon: Briefcase,
      description: "Conduct business meetings and commercial activities",
      processingTime: "3-5 business days",
      validity: "90 days",
      price: 299,
      color: "emerald",
      category: "Business",
      requirements: [
        "Valid passport (6+ months validity)",
        "Business invitation letter",
        "Company registration documents",
        "Purpose of visit detailed letter",
        "Meeting schedules and contacts",
        "Financial guarantee documents",
        "Chamber of Commerce certificate",
      ],
      features: [
        "Business activities permitted",
        "Company sponsorship support",
        "Meeting attendance allowed",
        "Commercial negotiation purposes",
      ],
    },
    {
      id: "student",
      name: "Student Visa",
      icon: GraduationCap,
      description: "Study at recognized educational institutions",
      processingTime: "7-10 business days",
      validity: "1 year",
      price: 179,
      color: "purple",
      category: "Education",
      requirements: [
        "Valid passport (6+ months validity)",
        "University admission letter",
        "Academic transcripts and certificates",
        "Financial capability proof",
        "Medical examination certificate",
        "Educational background verification",
        "Guardian consent (if under 18)",
      ],
      features: [
        "University admission required",
        "Renewable annually",
        "Part-time work permissions",
        "Student support services",
      ],
    },
    {
      id: "job-waqala",
      name: "Job Waqala Visa",
      icon: Users,
      description: "Legal representation and business delegation",
      processingTime: "5-7 business days",
      validity: "30 days",
      price: 399,
      color: "orange",
      category: "Professional",
      requirements: [
        "Valid passport (6+ months validity)",
        "Legal authorization letter",
        "Business delegation documents",
        "Sponsor company details",
        "Purpose specification letter",
        "Professional qualifications",
        "Legal representation agreement",
      ],
      features: [
        "Legal representation rights",
        "Business delegation authority",
        "Special authorization privileges",
        "Professional service purposes",
      ],
    },
  ];

  useEffect(() => {
    async function fetchUmrahVisas() {
      setUmrahLoading(true);
      const { data, error } = await supabase
        .from("saudi_visas")
        .select("*")
        .eq("visa_type", "Umrah Visa")
        .eq("status", "active");
      if (error) {
        setUmrahVisas([]);
        setUmrahLoading(false);
        toast({
          title: "Error fetching Umrah visas",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      if (data) {
        setUmrahVisas(data);
      } else {
        setUmrahVisas([]);
      }
      setUmrahLoading(false);
    }
    fetchUmrahVisas();
  }, [toast]);

  useEffect(() => {
    async function fetchOtherVisas() {
      setOtherVisasLoading(true);
      const { data, error } = await supabase
        .from("saudi_visas")
        .select("*")
        .neq("visa_type", "Umrah Visa")
        .eq("status", "active");
      if (error) {
        setOtherVisas([]);
        setOtherVisasLoading(false);
        toast({
          title: "Error fetching other visas",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      if (data) {
        setOtherVisas(data);
      } else {
        setOtherVisas([]);
      }
      setOtherVisasLoading(false);
    }
    fetchOtherVisas();
  }, [toast]);

  const handleApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVisa || !applicationDate) {
      toast({
        title: "Error",
        description: "Please complete all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const applicationData = {
        ...applicationForm,
        visaType: selectedVisa.id,
        applicationDate: applicationDate,
        estimatedCost: Math.round(selectedVisa.price),
        status: "pending",
      };

      console.log("Visa application data:", applicationData);

      toast({
        title: "Application Submitted Successfully!",
        description:
          "We'll review your application and contact you within 24 hours with next steps and document requirements.",
      });

      // Reset form
      setApplicationForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        nationality: "",
        passportNumber: "",
        dateOfBirth: "",
        purpose: "",
        duration: "",
        specialRequests: "",
      });
      setSelectedVisa(null);
      setApplicationDate(undefined);
      setCurrentStep(1);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "Failed to submit visa application",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1 && !selectedVisa) {
      toast({
        title: "Selection Required",
        description: "Please select a visa type to continue",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep(Math.min(currentStep + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 1));
  };

  const groupedVisas = visaTypes.reduce(
    (acc, visa) => {
      if (!acc[visa.category]) acc[visa.category] = [];
      acc[visa.category].push(visa);
      return acc;
    },
    {} as Record<string, VisaType[]>,
  );

  const toggleDesc = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: { ...prev[id], desc: !prev[id]?.desc },
    }));
  };

  const toggleProc = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: { ...prev[id], proc: !prev[id]?.proc },
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-blue-50 via-white to-green-50 pb-8">
          <div className="container mx-auto px-4 pt-8 pb-4 flex flex-col items-center text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 rounded-full px-4 py-2 mb-4 animate-fade-in">
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">100% Approval Rate</span>
              <span className="mx-2">•</span>
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium">
                Trusted by 2,000+ clients
              </span>
              <span className="mx-2">•</span>
              <Award className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">
                Official Saudi Partner
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 animate-slide-up">
              Get Your Saudi Visa—Fast, Trusted, Hassle-Free
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6 animate-fade-in">
              Apply online in minutes. Secure payment. 24/7 expert support. 100%
              money-back guarantee if not approved.
            </p>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > step ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-0.5 ${currentStep > step ? "bg-blue-600" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="container mx-auto px-2 sm:px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {otherVisas.map((visa) => (
              <VisaCard
                key={visa.id || visa.visa_category || visa.description}
                visa={visa}
                expanded={expanded}
                toggleDesc={toggleDesc}
                toggleProc={toggleProc}
                toggleDocs={toggleDesc}
                onApply={() => {}}
              />
            ))}
          </div>
        </div>

        {/* Testimonials/Social Proof */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-lg p-6 text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 text-gray-900">
              Why 2,000+ Travelers Trust Marhaba Haji
            </h2>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-4">
              <div className="max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold text-lg text-gray-800">
                    4.9/5
                  </span>
                </div>
                <p className="text-gray-700 italic">
                  "The process was so smooth and fast! I got my Saudi visa in 2
                  days. Highly recommended."
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  — Ayesha K., Mumbai
                </div>
              </div>
              <div className="max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold text-lg text-gray-800">
                    100% Approval
                  </span>
                </div>
                <p className="text-gray-700 italic">
                  "I was worried about documents, but the team guided me at
                  every step. 100% trustworthy."
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  — Imran S., Hyderabad
                </div>
              </div>
              <div className="max-w-xs">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold text-lg text-gray-800">
                    24/7 Support
                  </span>
                </div>
                <p className="text-gray-700 italic">
                  "Anytime I had a question, support was just a WhatsApp away.
                  Amazing service!"
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  — Fatima R., Delhi
                </div>
              </div>
            </div>
          </div>
        </div>
        <WhatsAppWidget />
      </div>

      <Footer />
    </div>
  );
};

export default OtherSaudiVisas;
