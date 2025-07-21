import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Star,
  Plane,
  MapPin,
  CreditCard,
  Utensils,
  User,
  Phone,
  Mail,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { HajjPackage } from "./HajjPackages";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type Hotel = { id: string; name: string; [key: string]: unknown };
type Activity = {
  id: string;
  name: string;
  description?: string;
  featured_image?: string;
};

const HajjPackageDetail: React.FC = () => {
  const { slug } = useParams();
  const [pkg, setPkg] = useState<HajjPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [infantCount, setInfantCount] = useState(0);
  const [quintCount, setQuintCount] = useState(0);
  const [quadCount, setQuadCount] = useState(0);
  const [tripleCount, setTripleCount] = useState(0);
  const [doubleCount, setDoubleCount] = useState(0);
  const [singleCount, setSingleCount] = useState(0);
  const roomTypes = [
    { value: "", label: "Select room type" },
    { value: "sharing", label: "Sharing room" },
    { value: "private", label: "Private room" },
  ];
  const [makkahHotel, setMakkahHotel] = useState<Hotel | null>(null);
  const [madinahHotel, setMadinahHotel] = useState<Hotel | null>(null);
  const [activityDetails, setActivityDetails] = useState<Activity[]>([]);
  const [expandedActivities, setExpandedActivities] = useState<{
    [id: string]: boolean;
  }>({});
  const toggleActivityExpand = (id: string) => {
    setExpandedActivities((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    fullName: "",
    countryCode: "+91",
    mobile: "",
    maktabCategory: "",
    accommodationType: "",
    adultCount: 1,
    childCount: 0,
    infantCount: 0,
    departureCity: "",
    durationCategory: "",
    packageClass: "",
  });

  const maktabCategories = ["A", "B", "C", "D"];
  const accommodationTypes = ["Shifting", "Non-Shifting"];
  const durationCategories = [
    { value: "short", label: "Short (10-20 days)" },
    { value: "medium", label: "Medium (20-30 days)" },
    { value: "long", label: "Long (30-45 days)" },
  ];
  const packageClasses = ["Budget", "Deluxe", "Premium", "Luxury"];

  // Country code dropdown (searchable)
  const countryCodes = [
    { code: "+93", name: "Afghanistan" },
    { code: "+355", name: "Albania" },
    { code: "+213", name: "Algeria" },
    { code: "+1-684", name: "American Samoa" },
    { code: "+376", name: "Andorra" },
    { code: "+244", name: "Angola" },
    { code: "+1-264", name: "Anguilla" },
    { code: "+672", name: "Antarctica" },
    { code: "+1-268", name: "Antigua and Barbuda" },
    { code: "+54", name: "Argentina" },
    { code: "+374", name: "Armenia" },
    { code: "+297", name: "Aruba" },
    { code: "+61", name: "Australia" },
    { code: "+43", name: "Austria" },
    { code: "+994", name: "Azerbaijan" },
    { code: "+1-242", name: "Bahamas" },
    { code: "+973", name: "Bahrain" },
    { code: "+880", name: "Bangladesh" },
    { code: "+1-246", name: "Barbados" },
    { code: "+375", name: "Belarus" },
    { code: "+32", name: "Belgium" },
    { code: "+501", name: "Belize" },
    { code: "+229", name: "Benin" },
    { code: "+1-441", name: "Bermuda" },
    { code: "+975", name: "Bhutan" },
    { code: "+591", name: "Bolivia" },
    { code: "+387", name: "Bosnia and Herzegovina" },
    { code: "+267", name: "Botswana" },
    { code: "+55", name: "Brazil" },
    { code: "+246", name: "British Indian Ocean Territory" },
    { code: "+1-284", name: "British Virgin Islands" },
    { code: "+673", name: "Brunei" },
    { code: "+359", name: "Bulgaria" },
    { code: "+226", name: "Burkina Faso" },
    { code: "+257", name: "Burundi" },
    { code: "+855", name: "Cambodia" },
    { code: "+237", name: "Cameroon" },
    { code: "+1", name: "Canada" },
    { code: "+238", name: "Cape Verde" },
    { code: "+1-345", name: "Cayman Islands" },
    { code: "+236", name: "Central African Republic" },
    { code: "+235", name: "Chad" },
    { code: "+56", name: "Chile" },
    { code: "+86", name: "China" },
    { code: "+61", name: "Christmas Island" },
    { code: "+61", name: "Cocos Islands" },
    { code: "+57", name: "Colombia" },
    { code: "+269", name: "Comoros" },
    { code: "+682", name: "Cook Islands" },
    { code: "+506", name: "Costa Rica" },
    { code: "+385", name: "Croatia" },
    { code: "+53", name: "Cuba" },
    { code: "+599", name: "Curacao" },
    { code: "+357", name: "Cyprus" },
    { code: "+420", name: "Czech Republic" },
    { code: "+243", name: "Democratic Republic of the Congo" },
    { code: "+45", name: "Denmark" },
    { code: "+253", name: "Djibouti" },
    { code: "+1-767", name: "Dominica" },
    { code: "+1-809", name: "Dominican Republic" },
    { code: "+670", name: "East Timor" },
    { code: "+593", name: "Ecuador" },
    { code: "+20", name: "Egypt" },
    { code: "+503", name: "El Salvador" },
    { code: "+240", name: "Equatorial Guinea" },
    { code: "+291", name: "Eritrea" },
    { code: "+372", name: "Estonia" },
    { code: "+251", name: "Ethiopia" },
    { code: "+500", name: "Falkland Islands" },
    { code: "+298", name: "Faroe Islands" },
    { code: "+679", name: "Fiji" },
    { code: "+358", name: "Finland" },
    { code: "+33", name: "France" },
    { code: "+594", name: "French Guiana" },
    { code: "+689", name: "French Polynesia" },
    { code: "+241", name: "Gabon" },
    { code: "+220", name: "Gambia" },
    { code: "+995", name: "Georgia" },
    { code: "+49", name: "Germany" },
    { code: "+233", name: "Ghana" },
    { code: "+350", name: "Gibraltar" },
    { code: "+30", name: "Greece" },
    { code: "+299", name: "Greenland" },
    { code: "+1-473", name: "Grenada" },
    { code: "+590", name: "Guadeloupe" },
    { code: "+1-671", name: "Guam" },
    { code: "+502", name: "Guatemala" },
    { code: "+44-1481", name: "Guernsey" },
    { code: "+224", name: "Guinea" },
    { code: "+245", name: "Guinea-Bissau" },
    { code: "+592", name: "Guyana" },
    { code: "+509", name: "Haiti" },
    { code: "+504", name: "Honduras" },
    { code: "+852", name: "Hong Kong" },
    { code: "+36", name: "Hungary" },
    { code: "+354", name: "Iceland" },
    { code: "+91", name: "India" },
    { code: "+62", name: "Indonesia" },
    { code: "+98", name: "Iran" },
    { code: "+964", name: "Iraq" },
    { code: "+353", name: "Ireland" },
    { code: "+44-1624", name: "Isle of Man" },
    { code: "+972", name: "Israel" },
    { code: "+39", name: "Italy" },
    { code: "+225", name: "Ivory Coast" },
    { code: "+1-876", name: "Jamaica" },
    { code: "+81", name: "Japan" },
    { code: "+44-1534", name: "Jersey" },
    { code: "+962", name: "Jordan" },
    { code: "+7", name: "Kazakhstan" },
    { code: "+254", name: "Kenya" },
    { code: "+686", name: "Kiribati" },
    { code: "+383", name: "Kosovo" },
    { code: "+965", name: "Kuwait" },
    { code: "+996", name: "Kyrgyzstan" },
    { code: "+856", name: "Laos" },
    { code: "+371", name: "Latvia" },
    { code: "+961", name: "Lebanon" },
    { code: "+266", name: "Lesotho" },
    { code: "+231", name: "Liberia" },
    { code: "+218", name: "Libya" },
    { code: "+423", name: "Liechtenstein" },
    { code: "+370", name: "Lithuania" },
    { code: "+352", name: "Luxembourg" },
    { code: "+853", name: "Macau" },
    { code: "+389", name: "Macedonia" },
    { code: "+261", name: "Madagascar" },
    { code: "+265", name: "Malawi" },
    { code: "+60", name: "Malaysia" },
    { code: "+960", name: "Maldives" },
    { code: "+223", name: "Mali" },
    { code: "+356", name: "Malta" },
    { code: "+692", name: "Marshall Islands" },
    { code: "+596", name: "Martinique" },
    { code: "+222", name: "Mauritania" },
    { code: "+230", name: "Mauritius" },
    { code: "+262", name: "Mayotte" },
    { code: "+52", name: "Mexico" },
    { code: "+691", name: "Micronesia" },
    { code: "+373", name: "Moldova" },
    { code: "+377", name: "Monaco" },
    { code: "+976", name: "Mongolia" },
    { code: "+382", name: "Montenegro" },
    { code: "+1-664", name: "Montserrat" },
    { code: "+212", name: "Morocco" },
    { code: "+258", name: "Mozambique" },
    { code: "+95", name: "Myanmar" },
    { code: "+264", name: "Namibia" },
    { code: "+674", name: "Nauru" },
    { code: "+977", name: "Nepal" },
    { code: "+31", name: "Netherlands" },
    { code: "+599", name: "Netherlands Antilles" },
    { code: "+687", name: "New Caledonia" },
    { code: "+64", name: "New Zealand" },
    { code: "+505", name: "Nicaragua" },
    { code: "+227", name: "Niger" },
    { code: "+234", name: "Nigeria" },
    { code: "+683", name: "Niue" },
    { code: "+672", name: "Norfolk Island" },
    { code: "+850", name: "North Korea" },
    { code: "+1-670", name: "Northern Mariana Islands" },
    { code: "+47", name: "Norway" },
    { code: "+968", name: "Oman" },
    { code: "+92", name: "Pakistan" },
    { code: "+680", name: "Palau" },
    { code: "+970", name: "Palestine" },
    { code: "+507", name: "Panama" },
    { code: "+675", name: "Papua New Guinea" },
    { code: "+595", name: "Paraguay" },
    { code: "+51", name: "Peru" },
    { code: "+63", name: "Philippines" },
    { code: "+48", name: "Poland" },
    { code: "+351", name: "Portugal" },
    { code: "+1-787", name: "Puerto Rico" },
    { code: "+974", name: "Qatar" },
    { code: "+242", name: "Republic of the Congo" },
    { code: "+262", name: "Reunion" },
    { code: "+40", name: "Romania" },
    { code: "+7", name: "Russia" },
    { code: "+250", name: "Rwanda" },
    { code: "+590", name: "Saint Barthelemy" },
    { code: "+290", name: "Saint Helena" },
    { code: "+1-869", name: "Saint Kitts and Nevis" },
    { code: "+1-758", name: "Saint Lucia" },
    { code: "+590", name: "Saint Martin" },
    { code: "+508", name: "Saint Pierre and Miquelon" },
    { code: "+1-784", name: "Saint Vincent and the Grenadines" },
    { code: "+685", name: "Samoa" },
    { code: "+378", name: "San Marino" },
    { code: "+239", name: "Sao Tome and Principe" },
    { code: "+966", name: "Saudi Arabia" },
    { code: "+221", name: "Senegal" },
    { code: "+381", name: "Serbia" },
    { code: "+248", name: "Seychelles" },
    { code: "+232", name: "Sierra Leone" },
    { code: "+65", name: "Singapore" },
    { code: "+1-721", name: "Sint Maarten" },
    { code: "+421", name: "Slovakia" },
    { code: "+386", name: "Slovenia" },
    { code: "+677", name: "Solomon Islands" },
    { code: "+252", name: "Somalia" },
    { code: "+27", name: "South Africa" },
    { code: "+82", name: "South Korea" },
    { code: "+211", name: "South Sudan" },
    { code: "+34", name: "Spain" },
    { code: "+94", name: "Sri Lanka" },
    { code: "+249", name: "Sudan" },
    { code: "+597", name: "Suriname" },
    { code: "+47", name: "Svalbard and Jan Mayen" },
    { code: "+268", name: "Swaziland" },
    { code: "+46", name: "Sweden" },
    { code: "+41", name: "Switzerland" },
    { code: "+963", name: "Syria" },
    { code: "+886", name: "Taiwan" },
    { code: "+992", name: "Tajikistan" },
    { code: "+255", name: "Tanzania" },
    { code: "+66", name: "Thailand" },
    { code: "+228", name: "Togo" },
    { code: "+690", name: "Tokelau" },
    { code: "+676", name: "Tonga" },
    { code: "+1-868", name: "Trinidad and Tobago" },
    { code: "+216", name: "Tunisia" },
    { code: "+90", name: "Turkey" },
    { code: "+993", name: "Turkmenistan" },
    { code: "+1-649", name: "Turks and Caicos Islands" },
    { code: "+688", name: "Tuvalu" },
    { code: "+256", name: "Uganda" },
    { code: "+380", name: "Ukraine" },
    { code: "+971", name: "United Arab Emirates" },
    { code: "+44", name: "United Kingdom" },
    { code: "+1", name: "United States" },
    { code: "+598", name: "Uruguay" },
    { code: "+998", name: "Uzbekistan" },
    { code: "+678", name: "Vanuatu" },
    { code: "+58", name: "Venezuela" },
    { code: "+84", name: "Vietnam" },
    { code: "+1-284", name: "Virgin Islands, British" },
    { code: "+1-340", name: "Virgin Islands, U.S." },
    { code: "+681", name: "Wallis and Futuna" },
    { code: "+212", name: "Western Sahara" },
    { code: "+967", name: "Yemen" },
    { code: "+260", name: "Zambia" },
    { code: "+263", name: "Zimbabwe" },
  ];
  const [countrySearch, setCountrySearch] = useState("");
  const filteredCountryCodes = countryCodes.filter((c) => {
    const search = countrySearch.trim().toLowerCase();
    if (!search) return true;
    return (
      c.name
        .toLowerCase()
        .replace(/\s+/g, "")
        .includes(search.replace(/\s+/g, "")) ||
      c.code.replace(/[^0-9+]/g, "").includes(search.replace(/[^0-9+]/g, ""))
    );
  });
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);

  const { toast } = useToast();

  function handleQuoteChange(field: string, value: string | number) {
    setQuoteForm((prev) => ({ ...prev, [field]: value }));
  }
  async function handleQuoteSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Prepare data for leads table
    const [firstName, ...lastNameParts] = quoteForm.fullName.trim().split(" ");
    const lastName = lastNameParts.join(" ");
    const leadData = {
      first_name: firstName,
      last_name: lastName,
      country_code: quoteForm.countryCode,
      phone: quoteForm.mobile,
      maktab_category: quoteForm.maktabCategory,
      accommodation_type: quoteForm.accommodationType,
      adult_count: quoteForm.adultCount,
      child_count: quoteForm.childCount,
      infant_count: quoteForm.infantCount,
      city: quoteForm.departureCity,
      duration_category: quoteForm.durationCategory,
      package_class: quoteForm.packageClass,
      number_of_travelers:
        quoteForm.adultCount + quoteForm.childCount + quoteForm.infantCount,
      service_interest: "Hajj Package",
      lead_source: "hajj_package_detail",
      created_at: new Date().toISOString(),
    };
    const { error } = await supabase.from("leads").insert([leadData]);
    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description:
          "Your request has been submitted. We will contact you soon.",
      });
      setShowQuoteModal(false);
    }
  }

  useEffect(() => {
    if (!pkg) return;

    // Fetch Makkah hotel if needed
    if (pkg.makkah_hotel && typeof pkg.makkah_hotel === "string") {
      supabase
        .from("hotels")
        .select("*")
        .eq("id", pkg.makkah_hotel)
        .single()
        .then(({ data }) => setMakkahHotel(data));
    } else if (pkg.makkah_hotel) {
      setMakkahHotel(pkg.makkah_hotel);
    } else {
      setMakkahHotel(null);
    }

    // Fetch Madinah hotel if needed
    if (pkg.madinah_hotel && typeof pkg.madinah_hotel === "string") {
      supabase
        .from("hotels")
        .select("*")
        .eq("id", pkg.madinah_hotel)
        .single()
        .then(({ data }) => setMadinahHotel(data));
    } else if (pkg.madinah_hotel) {
      setMadinahHotel(pkg.madinah_hotel);
    } else {
      setMadinahHotel(null);
    }
  }, [pkg]);

  useEffect(() => {
    if (!pkg) return;
    // Fetch activities if needed
    if (Array.isArray(pkg.activities) && pkg.activities.length > 0) {
      if (typeof pkg.activities[0] === "object" && pkg.activities[0].name) {
        setActivityDetails(pkg.activities);
      } else {
        // Assume array of IDs
        supabase
          .from("activities")
          .select("id, name, description, featured_image")
          .in("id", pkg.activities)
          .then(({ data }) => setActivityDetails(data || []));
      }
    } else {
      setActivityDetails([]);
    }
  }, [pkg]);

  useEffect(() => {
    const fetchPackage = async () => {
      setLoading(true);
      console.debug("Fetching Hajj package with slug:", slug);
      const { data, error } = await supabase
        .from("hajj_packages")
        .select("*")
        .eq("slug", slug)
        .single();
      console.debug("Result for top-level slug:", { data, error });

      // If not found, try seo.slug
      if ((!data || error) && slug) {
        const { data: data2, error: error2 } = await supabase
          .from("hajj_packages")
          .select("*")
          .eq("seo->>slug", slug)
          .single();
        console.debug("Result for seo.slug:", { data2, error2 });
        if (data2 && !error2) {
          setPkg(data2 as HajjPackage);
          setError(null);
          setLoading(false);
          return;
        }
      }

      if (error || !data) {
        console.debug("Package not found for slug:", slug);
        setError("Package not found.");
        setPkg(null);
      } else {
        setPkg(data as HajjPackage);
        setError(null);
        console.log("Fetched package:", data);
      }
      setLoading(false);
    };
    if (slug) fetchPackage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-emerald-700 text-xl">
        Loading...
      </div>
    );
  }
  if (error || !pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
        {error || "Package not found."}
      </div>
    );
  }

  // Parse prices from pkg
  let parsedPrices = { adult: 0, child: 0, infant: 0 };
  let parsedPrivatePrices = {
    quint: 0,
    quad: 0,
    triple: 0,
    double: 0,
    single: 0,
    child: 0,
  };
  try {
    const pricesObj =
      typeof pkg.prices === "string"
        ? JSON.parse(pkg.prices)
        : pkg.prices || {};
    if (pricesObj?.sharing) {
      parsedPrices = {
        adult: parseInt(pricesObj.sharing.adult || "0"),
        child: parseInt(pricesObj.sharing.child || "0"),
        infant: parseInt(pricesObj.sharing.infant || "0"),
      };
    }
    if (pricesObj?.private) {
      parsedPrivatePrices = {
        quint: parseInt(pricesObj.private.quint || "0"),
        quad: parseInt(pricesObj.private.quad || "0"),
        triple: parseInt(pricesObj.private.triple || "0"),
        double: parseInt(pricesObj.private.double || "0"),
        single: parseInt(pricesObj.private.single || "0"),
        child: parseInt(pricesObj.private.child || "0"),
      };
    }
  } catch {
    // ignore JSON parse error
  }
  const prices = parsedPrices;
  const privatePrices = parsedPrivatePrices;

  // Now do all calculations that use prices/privatePrices
  const totalTravelers = adultCount + childCount + infantCount;
  const adultTotal = adultCount * prices.adult;
  const childTotal = childCount * prices.child;
  const infantTotal = infantCount * prices.infant;
  const totalRooms =
    quintCount + quadCount + tripleCount + doubleCount + singleCount;
  const privateTotal =
    quintCount * privatePrices.quint +
    quadCount * privatePrices.quad +
    tripleCount * privatePrices.triple +
    doubleCount * privatePrices.double +
    singleCount * privatePrices.single +
    childCount * privatePrices.child;
  const totalTravelersPrivate =
    quintCount * 5 +
    quadCount * 4 +
    tripleCount * 3 +
    doubleCount * 2 +
    singleCount * 1 +
    childCount;

  // Helper for currency
  const getCurrencySymbol = (currency: string | undefined) => {
    switch ((currency || "INR").toUpperCase()) {
      case "INR":
        return "₹";
      case "USD":
        return "$";
      case "SAR":
        return "﷼";
      default:
        return currency ? currency.toUpperCase() + " " : "₹";
    }
  };

  // Add a simple HTML sanitizer for activity descriptions
  function sanitizeHtml(html: string) {
    // Remove <script> and <style> tags and their content
    return html
      .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      <Header />
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden flex items-end">
        {/* Overlayed badges for package type and category */}
        <div className="absolute top-4 left-4 flex gap-2 z-10">
          {/* Removed Hajj 2025 badge as requested */}
          {pkg.category && (
            <Badge className="bg-blue-700 text-white shadow font-bold px-3 py-1 text-base rounded-full">
              {pkg.category}
            </Badge>
          )}
          {pkg.maktab_category && (
            <Badge className="bg-yellow-100 text-yellow-800 font-bold px-3 py-1 text-base rounded-full text-sm shadow border border-yellow-200">
              Maktab {pkg.maktab_category}
            </Badge>
          )}
          {pkg.category && (
            <Badge className="bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-sm shadow border border-emerald-200">
              {pkg.category}
            </Badge>
          )}
          {/* Type Tag (Shifting/Non-Shifting) */}
          {pkg.type && (
            <span className="inline-flex items-center bg-purple-100 text-purple-800 font-bold px-3 py-1 rounded-full text-sm shadow border border-purple-200">
              {pkg.type}
            </span>
          )}
          {/* Duration Category Tag (Short/Medium/Long) */}
          {pkg.duration_category && (
            <span className="inline-flex items-center bg-orange-100 text-orange-800 font-bold px-3 py-1 rounded-full text-sm shadow border border-orange-200">
              {pkg.duration_category.charAt(0).toUpperCase() +
                pkg.duration_category.slice(1)}
            </span>
          )}
        </div>
        <img
          src={pkg.featured_image || "/public/placeholder.svg"}
          alt={pkg.title}
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="container mx-auto px-4 pb-8 relative z-10">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 drop-shadow-lg">
              {pkg.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-white/90 text-lg">
              {/* Removed duration (Calendar icon and text) as requested */}
            </div>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-8"
            >
              <TabsList className="flex justify-between items-center bg-amber-50 rounded-xl p-2 w-full mb-6 gap-2">
                <TabsTrigger
                  value="overview"
                  className="flex-1 text-center data-[state=active]:bg-[#023f3a] data-[state=active]:text-white rounded-lg font-medium py-3"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="hotels"
                  className="flex-1 text-center data-[state=active]:bg-[#023f3a] data-[state=active]:text-white rounded-lg font-medium py-3"
                >
                  Hotels
                </TabsTrigger>
                <TabsTrigger
                  value="itinerary"
                  className="flex-1 text-center data-[state=active]:bg-[#023f3a] data-[state=active]:text-white rounded-lg font-medium py-3"
                >
                  Itinerary
                </TabsTrigger>
                <TabsTrigger
                  value="activities"
                  className="flex-1 text-center data-[state=active]:bg-[#023f3a] data-[state=active]:text-white rounded-lg font-medium py-3"
                >
                  Activities
                </TabsTrigger>
                <TabsTrigger
                  value="pricing"
                  className="flex-1 text-center data-[state=active]:bg-[#023f3a] data-[state=active]:text-white rounded-lg font-medium py-3"
                >
                  Pricing
                </TabsTrigger>
                <TabsTrigger
                  value="terms"
                  className="flex-1 text-center data-[state=active]:bg-[#023f3a] data-[state=active]:text-white rounded-lg font-medium py-3"
                >
                  Terms
                </TabsTrigger>
              </TabsList>
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8">
                {/* Hero Card - exact match to PackageDetailDynamic */}
                <div className="mb-8 bg-gradient-to-br from-emerald-50 to-white rounded-2xl shadow-xl p-8 border border-emerald-200 animate-fade-in-up">
                  <div className="flex flex-wrap gap-3 items-center mb-2">
                    <span className="inline-flex items-center bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-sm shadow border border-blue-200">
                      🕋 Group
                    </span>
                    {pkg.maktab_category && (
                      <span className="inline-flex items-center bg-yellow-100 text-yellow-800 font-bold px-3 py-1 rounded-full text-sm shadow border border-yellow-200">
                        Maktab {pkg.maktab_category}
                      </span>
                    )}
                    {pkg.category && (
                      <span className="inline-flex items-center bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-sm shadow border border-emerald-200">
                        {pkg.category}
                      </span>
                    )}
                    {/* Type Tag (Shifting/Non-Shifting) */}
                    {pkg.type && (
                      <span className="inline-flex items-center bg-purple-100 text-purple-800 font-bold px-3 py-1 rounded-full text-sm shadow border border-purple-200">
                        {pkg.type}
                      </span>
                    )}
                    {/* Duration Category Tag (Short/Medium/Long) */}
                    {pkg.duration_category && (
                      <span className="inline-flex items-center bg-orange-100 text-orange-800 font-bold px-3 py-1 rounded-full text-sm shadow border border-orange-200">
                        {pkg.duration_category.charAt(0).toUpperCase() +
                          pkg.duration_category.slice(1)}
                      </span>
                    )}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-900 leading-tight drop-shadow mb-2">
                    {pkg.name}
                  </h1>
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-4 prose max-w-none">
                    {pkg.description}
                  </p>
                  {/* Quick Facts Row */}
                  <div className="flex flex-wrap gap-3 items-center mt-4">
                    <span className="inline-flex items-center bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium gap-1">
                      <Calendar className="w-4 h-4" />
                      {pkg.duration || "Duration not specified"}
                    </span>
                    {pkg.departure_date && (
                      <span className="inline-flex items-center bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm font-medium gap-1">
                        <Plane className="w-4 h-4" />
                        {new Date(pkg.departure_date).toLocaleDateString()}
                      </span>
                    )}
                    {pkg.cities_covered && pkg.cities_covered.length > 0 && (
                      <span className="inline-flex items-center bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium gap-1">
                        <MapPin className="w-4 h-4" />
                        {pkg.cities_covered.join(" & ")}
                      </span>
                    )}
                    <span className="inline-flex items-center bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full text-sm font-bold gap-1">
                      <CreditCard className="w-4 h-4" />
                      {getCurrencySymbol(pkg.currency)}
                      {pkg.price?.toLocaleString()}
                    </span>
                    {pkg.meal_plan && (
                      <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold gap-1 ml-2">
                        <Utensils className="w-4 h-4" />
                        {pkg.meal_plan}
                      </span>
                    )}
                  </div>
                </div>
                {/* Inclusions/Exclusions */}
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Inclusions & Exclusions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <div className="mb-3 flex items-center gap-2 font-semibold text-green-700">
                          <CheckCircle className="w-5 h-5 text-green-600" />{" "}
                          Inclusions
                        </div>
                        <ul className="space-y-2 mt-1">
                          {pkg.inclusions?.length ? (
                            pkg.inclusions.map((inc, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-sm"
                              >
                                <CheckCircle className="w-4 h-4 mt-0.5 text-green-500 shrink-0" />
                                <span>{inc}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-gray-400">
                              No inclusions listed.
                            </li>
                          )}
                        </ul>
                      </div>
                      <div>
                        <div className="mb-3 flex items-center gap-2 font-semibold text-red-700">
                          <XCircle className="w-5 h-5 text-red-600" />{" "}
                          Exclusions
                        </div>
                        <ul className="space-y-2 mt-1">
                          {pkg.exclusions?.length ? (
                            pkg.exclusions.map((exc, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-sm"
                              >
                                <XCircle className="w-4 h-4 mt-0.5 text-red-500 shrink-0" />
                                <span>{exc}</span>
                              </li>
                            ))
                          ) : (
                            <li className="text-gray-400">
                              No exclusions listed.
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              {/* Hotels Tab */}
              <TabsContent value="hotels">
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Hotels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Makkah Hotel */}
                      <div className="bg-emerald-50 rounded-xl p-6 shadow flex flex-col gap-2 border border-emerald-100">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-xl font-bold shadow-sm">
                            🕋
                          </span>
                          <span className="text-lg font-bold text-emerald-900">
                            Makkah Hotel
                          </span>
                        </div>
                        <div className="font-extrabold text-xl text-emerald-800 mb-1">
                          {pkg.makkah_hotel_name || "-"}
                        </div>
                        {pkg.makkah_hotel_category && (
                          <div className="flex items-center gap-2 text-sm text-emerald-700 mb-1">
                            <span className="inline-block w-4 h-4">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 2l2 7h7l-5.5 4 2 7-5.5-4-5.5 4 2-7L3 9h7l2-7z"
                                />
                              </svg>
                            </span>
                            {pkg.makkah_hotel_category}
                          </div>
                        )}
                        {pkg.makkah_hotel_distance && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <span className="inline-block w-4 h-4">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
                                />
                              </svg>
                            </span>
                            {pkg.makkah_hotel_distance}m from Haram
                          </div>
                        )}
                      </div>
                      {/* Madinah Hotel */}
                      <div className="bg-yellow-50 rounded-xl p-6 shadow flex flex-col gap-2 border border-yellow-100">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 text-xl font-bold shadow-sm">
                            🕌
                          </span>
                          <span className="text-lg font-bold text-yellow-900">
                            Madinah Hotel
                          </span>
                        </div>
                        <div className="font-extrabold text-xl text-yellow-800 mb-1">
                          {pkg.madinah_hotel_name || "-"}
                        </div>
                        {pkg.madinah_hotel_category && (
                          <div className="flex items-center gap-2 text-sm text-yellow-700 mb-1">
                            <span className="inline-block w-4 h-4">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 2l2 7h7l-5.5 4 2 7-5.5-4-5.5 4 2-7L3 9h7l2-7z"
                                />
                              </svg>
                            </span>
                            {pkg.madinah_hotel_category}
                          </div>
                        )}
                        {pkg.madinah_hotel_distance && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                            <span className="inline-block w-4 h-4">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
                                />
                              </svg>
                            </span>
                            {pkg.madinah_hotel_distance}m from Masjid Nabawi
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              {/* Itinerary Tab */}
              <TabsContent value="itinerary">
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Itinerary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Render itinerary from pkg with beautified timeline */}
                    {(() => {
                      let itinerary = [];
                      if (Array.isArray(pkg.itinerary)) {
                        itinerary = pkg.itinerary;
                      } else if (typeof pkg.itinerary === "string") {
                        try {
                          itinerary = JSON.parse(pkg.itinerary);
                        } catch {
                          // ignore JSON parse error
                        }
                      }
                      if (Array.isArray(itinerary) && itinerary.length > 0) {
                        return (
                          <div className="relative pl-6">
                            <div className="absolute left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-200 to-emerald-50 rounded-full" />
                            <ol className="space-y-8">
                              {itinerary.map((item, idx) => (
                                <li
                                  key={idx}
                                  className="relative flex gap-4 items-start"
                                >
                                  <span className="absolute -left-6 flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500 text-white font-bold text-lg shadow-lg border-4 border-white z-10">
                                    {idx + 1}
                                  </span>
                                  <div className="flex-1 bg-white rounded-xl shadow border border-emerald-100 p-5">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-base font-bold shadow-sm">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="w-4 h-4"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8v4l3 3"
                                          />
                                          <circle cx="12" cy="12" r="10" />
                                        </svg>
                                      </span>
                                      <span className="font-bold text-emerald-900 text-lg">
                                        {item.title || `Day ${idx + 1}`}
                                      </span>
                                    </div>
                                    <div className="text-gray-700 whitespace-pre-line text-base leading-relaxed">
                                      {item.description || ""}
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ol>
                          </div>
                        );
                      }
                      return (
                        <div className="text-gray-500">
                          No itinerary available.
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              </TabsContent>
              {/* Activities Tab */}
              <TabsContent value="activities">
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Render activities from database or pkg */}
                    {activityDetails.length > 0 ? (
                      <div className="flex flex-col gap-6">
                        {activityDetails.map((act, idx) => {
                          const actId = act.id || idx;
                          const expanded = expandedActivities[actId];
                          return (
                            <div
                              key={actId}
                              className={`flex bg-emerald-50 rounded-xl shadow border border-emerald-100 overflow-hidden transition-all duration-300 ${expanded ? "" : "h-36"}`}
                              style={{
                                minHeight: "9rem",
                                maxHeight: expanded ? "none" : "9rem",
                              }}
                            >
                              {act.featured_image ? (
                                <img
                                  src={act.featured_image}
                                  alt={act.name}
                                  className="w-36 h-36 object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-36 h-36 flex items-center justify-center bg-emerald-100 text-emerald-700 text-3xl font-bold flex-shrink-0">
                                  🏞️
                                </div>
                              )}
                              <div className="flex-1 p-5 flex flex-col justify-center">
                                <div className="font-bold text-emerald-900 text-lg mb-1 flex items-center gap-2">
                                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 text-base font-bold shadow-sm">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-4 h-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 8v4l3 3"
                                      />
                                      <circle cx="12" cy="12" r="10" />
                                    </svg>
                                  </span>
                                  {act.name}
                                </div>
                                <div
                                  className={`text-gray-700 text-base leading-relaxed transition-all duration-300 ${expanded ? "whitespace-pre-line" : "overflow-hidden text-ellipsis whitespace-nowrap max-h-6"}`}
                                  style={
                                    !expanded
                                      ? {
                                          display: "-webkit-box",
                                          WebkitLineClamp: 2,
                                          WebkitBoxOrient: "vertical",
                                        }
                                      : {}
                                  }
                                  dangerouslySetInnerHTML={{
                                    __html: sanitizeHtml(act.description || ""),
                                  }}
                                />
                                {act.description &&
                                  act.description.length > 180 && (
                                    <button
                                      className="mt-2 text-emerald-700 hover:underline text-sm font-semibold self-start"
                                      onClick={() =>
                                        toggleActivityExpand(actId)
                                      }
                                      type="button"
                                    >
                                      {expanded ? "View Less" : "View More"}
                                    </button>
                                  )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-gray-500">No activities listed.</div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              {/* Pricing Tab */}
              <TabsContent value="pricing">
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle>Comprehensive Pricing Chart</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {/* Modern pricing card layout */}
                    {(() => {
                      let pricesObj = {};
                      try {
                        pricesObj =
                          typeof pkg.prices === "string"
                            ? JSON.parse(pkg.prices)
                            : pkg.prices || {};
                      } catch {
                        // ignore JSON parse error
                      }
                      const sharing = pricesObj.sharing || {};
                      const priv = pricesObj.private || {};
                      const hasSharing =
                        Object.keys(sharing).length > 0 &&
                        Object.values(sharing).some((v) => v && v !== "0");
                      const hasPrivate =
                        Object.keys(priv).length > 0 &&
                        Object.values(priv).some((v) => v && v !== "0");
                      if (!hasSharing && !hasPrivate) {
                        return (
                          <div className="text-gray-500">No pricing data.</div>
                        );
                      }
                      const privateTypes = [
                        {
                          key: "quint",
                          label: "Quint Room",
                          icon: "M12 2l2 7h7l-5.5 4 2 7-5.5-4-5.5 4 2-7L3 9h7l2-7z",
                        },
                        {
                          key: "quad",
                          label: "Quad Room",
                          icon: "M4 21v-7a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v7",
                        },
                        {
                          key: "triple",
                          label: "Triple Room",
                          icon: "M4 21v-7a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v7",
                        },
                        {
                          key: "double",
                          label: "Double Room",
                          icon: "M4 21v-7a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v7",
                        },
                        {
                          key: "single",
                          label: "Single Room",
                          icon: "M12 2l2 7h7l-5.5 4 2 7-5.5-4-5.5 4 2-7L3 9h7l2-7z",
                        },
                      ];
                      return (
                        <div className="space-y-6">
                          {/* Sharing Room Card */}
                          {hasSharing && (
                            <div className="relative bg-gradient-to-br from-emerald-50 to-white rounded-2xl shadow-lg p-6 flex flex-col items-center border-2 border-emerald-200">
                              <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs px-3 py-1 rounded-full shadow">
                                Most Popular
                              </div>
                              <div className="flex items-center gap-3 mb-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-8 h-8 text-emerald-600"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                  <circle cx="9" cy="7" r="4"></circle>
                                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                                <span className="text-lg font-bold">
                                  Sharing Room
                                </span>
                              </div>
                              <div className="text-3xl font-extrabold text-emerald-700 mb-1">
                                {sharing.adult
                                  ? `₹${parseInt(sharing.adult).toLocaleString()}`
                                  : "-"}
                              </div>
                              <div className="text-gray-500 mb-2">
                                per traveler
                              </div>
                              <div className="flex gap-4 mt-2">
                                <div className="flex flex-col items-center">
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    Child (no bed)
                                    <span title="Ages 2-9, no separate bed">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-3 h-3 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M12 16v-4"></path>
                                        <path d="M12 8h.01"></path>
                                      </svg>
                                    </span>
                                  </span>
                                  <span className="font-semibold text-emerald-600">
                                    {sharing.child
                                      ? `₹${parseInt(sharing.child).toLocaleString()}`
                                      : "-"}
                                  </span>
                                </div>
                                <div className="flex flex-col items-center">
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    Infant
                                    <span title="Below 2 years">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-3 h-3 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                      >
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <path d="M12 16v-4"></path>
                                        <path d="M12 8h.01"></path>
                                      </svg>
                                    </span>
                                  </span>
                                  <span className="font-semibold text-emerald-600">
                                    {sharing.infant
                                      ? `₹${parseInt(sharing.infant).toLocaleString()}`
                                      : "-"}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 mt-4 text-xs text-gray-600 bg-emerald-100 rounded px-3 py-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-4 h-4 text-emerald-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <path d="M12 16v-4"></path>
                                  <path d="M12 8h.01"></path>
                                </svg>
                                <span>
                                  Sharing is typically{" "}
                                  <span className="font-semibold">
                                    4 or 5 in a room
                                  </span>
                                  . During{" "}
                                  <span className="font-semibold">Ramadan</span>
                                  , sharing may be up to{" "}
                                  <span className="font-semibold">
                                    6 in a room
                                  </span>
                                  .
                                </span>
                              </div>
                            </div>
                          )}
                          {/* Private Room Cards */}
                          <div className="flex flex-wrap gap-4 mt-6 justify-center">
                            {privateTypes.map(({ key, label }) =>
                              priv[key] ? (
                                <div
                                  key={key}
                                  className="bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow p-5 flex flex-col items-center border border-blue-200 min-w-[220px] flex-1 max-w-xs"
                                >
                                  <div className="flex items-center gap-2 mb-1">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-6 h-6 text-blue-600"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                      strokeWidth={2}
                                    >
                                      <path d="M2 4v16"></path>
                                      <path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
                                      <path d="M2 17h20"></path>
                                      <path d="M6 8v9"></path>
                                    </svg>
                                    <span className="font-semibold text-base">
                                      {label} Room
                                    </span>
                                  </div>
                                  <div className="text-2xl font-bold text-blue-700 mb-1">
                                    ₹{parseInt(priv[key]).toLocaleString()}
                                  </div>
                                  <div className="text-gray-500 mb-2">
                                    per room (
                                    {key === "quint"
                                      ? "5 travelers"
                                      : key === "quad"
                                        ? "4 travelers"
                                        : key === "triple"
                                          ? "3 travelers"
                                          : key === "double"
                                            ? "2 travelers"
                                            : key === "single"
                                              ? "1 traveler"
                                              : ""}
                                    )
                                  </div>
                                  <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                      <span className="text-xs text-gray-500 flex items-center gap-1">
                                        Child (no bed)
                                        <span title="Ages 2-9, no separate bed">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-3 h-3 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <circle
                                              cx="12"
                                              cy="12"
                                              r="10"
                                            ></circle>
                                            <path d="M12 16v-4"></path>
                                            <path d="M12 8h.01"></path>
                                          </svg>
                                        </span>
                                      </span>
                                      <span className="font-semibold text-blue-600">
                                        {priv.child
                                          ? `₹${parseInt(priv.child).toLocaleString()}`
                                          : "-"}
                                      </span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                      <span className="text-xs text-gray-500 flex items-center gap-1">
                                        Infant
                                        <span title="Below 2 years">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-3 h-3 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <circle
                                              cx="12"
                                              cy="12"
                                              r="10"
                                            ></circle>
                                            <path d="M12 16v-4"></path>
                                            <path d="M12 8h.01"></path>
                                          </svg>
                                        </span>
                                      </span>
                                      <span className="font-semibold text-blue-600">
                                        {sharing.infant
                                          ? `₹${parseInt(sharing.infant).toLocaleString()}`
                                          : "-"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ) : null,
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>
              </TabsContent>
              {/* Terms Tab */}
              <TabsContent value="terms">
                <Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
                  <CardHeader className="flex flex-col space-y-1.5 p-6">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-6 h-6 mr-2 text-yellow-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 16v-4"></path>
                        <path d="M12 8h.01"></path>
                      </svg>
                      Terms & Conditions
                    </h3>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="space-y-8">
                      {/* Payment Terms */}
                      <section>
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                          🧾 Payment Terms
                        </h3>
                        <div className="prose max-w-none text-gray-700">
                          {pkg.terms_and_conditions ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: pkg.terms_and_conditions,
                              }}
                            />
                          ) : (
                            <ul className="list-disc pl-6 space-y-1">
                              <li>
                                <strong>Booking Amount:</strong> A minimum of
                                50% of the total package value must be paid at
                                the time of booking to secure seats and initiate
                                visa, flight, and hotel arrangements.
                              </li>
                              <li>
                                <strong>Balance Payment:</strong> Full payment
                                must be cleared at least 15 days before the
                                departure date. For bookings made within 15 days
                                of departure, 100% upfront payment is required.
                              </li>
                              <li>
                                <strong>Non-Refundable Charges:</strong> A flat
                                amount of ₹5,000 per traveler is non-refundable
                                under any circumstances (covers administrative,
                                processing, and service charges).
                              </li>
                              <li>
                                <strong>Payment Methods & Surcharges:</strong>{" "}
                                Payments can be made via bank transfer, UPI,
                                payment gateways, or credit/debit cards.
                                Payments made via card swipe or payment gateways
                                will incur an additional 2% service charge.
                              </li>
                              <li>
                                <strong>
                                  Foreign Currency & Pricing Disclaimer:
                                </strong>{" "}
                                All package costs are quoted in Indian Rupees
                                (INR). Prices may vary based on forex
                                fluctuations, airline surcharges, or visa fee
                                changes.
                              </li>
                            </ul>
                          )}
                        </div>
                      </section>
                      <hr />
                      {/* Cancellation Policy */}
                      <section>
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                          ❌ Cancellation Policy
                        </h3>
                        <div className="prose max-w-none text-gray-700">
                          {pkg.cancellation_policy ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: pkg.cancellation_policy,
                              }}
                            />
                          ) : (
                            <ul className="list-disc pl-6 space-y-1">
                              <li>
                                <strong>Cancellation by Traveler:</strong>
                                <ul className="list-disc pl-8">
                                  <li>
                                    30+ days before departure: ₹5,000 per
                                    traveler retained.
                                  </li>
                                  <li>
                                    15–29 days before departure: 25% of the
                                    package cost retained.
                                  </li>
                                  <li>
                                    8–14 days before departure: 50% of the
                                    package cost retained.
                                  </li>
                                  <li>
                                    0–7 days before departure: 100% of the
                                    package cost retained (no refund).
                                  </li>
                                </ul>
                              </li>
                              <li>
                                <strong>Cancellation by Agency:</strong> In the
                                rare event that we cancel the tour for any
                                reason other than the traveler's fault, a full
                                refund or suitable travel credit will be
                                offered.
                              </li>
                            </ul>
                          )}
                        </div>
                      </section>
                      <hr />
                      {/* Refund Policy */}
                      <section>
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                          💰 Refund Policy
                        </h3>
                        <div className="prose max-w-none text-gray-700">
                          {pkg.refund_policy ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: pkg.refund_policy,
                              }}
                            />
                          ) : (
                            <ul className="list-disc pl-6 space-y-1">
                              <li>
                                <strong>Refund Processing Time:</strong> All
                                eligible refunds will be processed within 15 to
                                30 working days after deduction of applicable
                                fees and actual costs already incurred.
                              </li>
                              <li>
                                <strong>
                                  Non-Refundable Components Include:
                                </strong>
                                <ul className="list-disc pl-8">
                                  <li>Visa fee (once applied)</li>
                                  <li>
                                    Airline ticket charges (if non-refundable or
                                    issued)
                                  </li>
                                  <li>
                                    Hotel cancellation fees (as per hotel
                                    policy)
                                  </li>
                                  <li>
                                    Service and processing charges (₹5,000
                                    minimum)
                                  </li>
                                </ul>
                              </li>
                              <li>
                                <strong>No Refund Will Be Issued For:</strong>
                                <ul className="list-disc pl-8">
                                  <li>
                                    Voluntary withdrawal after visa issuance
                                  </li>
                                  <li>
                                    Missed departures or missed services due to
                                    personal delays
                                  </li>
                                  <li>
                                    Unused services (meals, transfers, hotel
                                    nights, etc.)
                                  </li>
                                </ul>
                              </li>
                            </ul>
                          )}
                        </div>
                      </section>
                      <hr />
                      {/* Traveler Responsibilities */}
                      <section>
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                          🧍🏽 Traveler Responsibilities
                        </h3>
                        <div className="prose max-w-none text-gray-700">
                          {pkg.traveler_responsibilities ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: pkg.traveler_responsibilities,
                              }}
                            />
                          ) : (
                            <ul className="list-disc pl-6 space-y-1">
                              <li>
                                <strong>Valid Travel Documents:</strong>{" "}
                                Travelers must hold a passport valid for at
                                least 6 months beyond the travel date and must
                                submit required documents (passport,
                                photographs, vaccine certificate, etc.) on time.
                              </li>
                              <li>
                                <strong>Information Accuracy:</strong> It is the
                                traveler's responsibility to provide correct and
                                complete information for visa processing. Any
                                errors may lead to visa rejection or delays.
                              </li>
                              <li>
                                <strong>Group Discipline & Conduct:</strong> All
                                travelers must maintain respectful behavior,
                                observe group timings, and follow tour leader
                                instructions. Disruptive or disrespectful
                                behavior may result in removal from the group
                                with no refund.
                              </li>
                              <li>
                                <strong>Health Disclosure & Fitness:</strong>{" "}
                                Please inform us in advance of any medical
                                condition or physical limitation. Travelers must
                                be fit for walking during Ziyarah and Umrah
                                rituals.
                              </li>
                              <li>
                                <strong>Arrival Timeliness:</strong> Travelers
                                must ensure they are punctual for airport
                                check-ins, group departures, Ziyarah, and
                                rituals. Delays may lead to missed components
                                with no reimbursement.
                              </li>
                            </ul>
                          )}
                        </div>
                      </section>
                      <hr />
                      {/* Disclaimers */}
                      <section>
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                          ⚠️ Disclaimers
                        </h3>
                        <div className="prose max-w-none text-gray-700">
                          {pkg.disclaimer ? (
                            <div
                              dangerouslySetInnerHTML={{
                                __html: pkg.disclaimer,
                              }}
                            />
                          ) : (
                            <ul className="list-disc pl-6 space-y-1">
                              <li>
                                <strong>Force Majeure:</strong> The agency is
                                not liable for delays, disruptions, or
                                cancellations caused by factors beyond our
                                control — including but not limited to natural
                                calamities, political unrest, pandemics,
                                government restrictions, airline/visa
                                rejections, or acts of God.
                              </li>
                              <li>
                                <strong>Itinerary Flexibility:</strong> While we
                                strive to honor the planned itinerary, we
                                reserve the right to modify hotels, flights, or
                                travel dates based on operational or logistic
                                necessities. Service quality will remain
                                equivalent or better.
                              </li>
                              <li>
                                <strong>Minimum Group Size:</strong> Certain
                                features (e.g. tour leader, shared transport)
                                may require a minimum number of participants. If
                                unmet, we may revise service inclusions or offer
                                an adjusted itinerary.
                              </li>
                              <li>
                                <strong>Religious Disclaimer:</strong> The
                                spiritual outcome of Umrah is solely with Allah.
                                We serve as facilitators and cannot guarantee
                                spiritual experiences or acceptance of worship.
                              </li>
                            </ul>
                          )}
                        </div>
                      </section>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-28 shadow-xl border-emerald-200 bg-white rounded-2xl p-6 mb-8">
              {/* Title and Icon */}
              <div className="flex items-center gap-2 mb-4">
                <User className="w-6 h-6 text-emerald-700" />
                <span className="text-2xl font-bold text-gray-900">
                  Customize Your Booking
                </span>
              </div>
              {/* Room Sharing Type Dropdown */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Sharing Type
                </label>
                <select
                  className="w-full rounded-lg border border-gray-200 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  value={selectedRoomType}
                  onChange={(e) => {
                    setSelectedRoomType(e.target.value);
                    // Reset counters on change
                    setAdultCount(1);
                    setChildCount(0);
                    setInfantCount(0);
                    setQuintCount(0);
                    setQuadCount(0);
                    setTripleCount(0);
                    setDoubleCount(0);
                    setSingleCount(0);
                  }}
                >
                  {roomTypes.map((rt) => (
                    <option
                      key={rt.value}
                      value={rt.value}
                      disabled={rt.value === ""}
                    >
                      {rt.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Traveler Counters for Sharing Room */}
              {selectedRoomType === "sharing" && (
                <>
                  {/* Adult Counter */}
                  <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-emerald-700" />
                      <span className="font-semibold text-emerald-900">
                        Adult
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 rounded bg-white border border-emerald-200 text-emerald-700 text-lg font-bold disabled:opacity-50"
                        onClick={() =>
                          setAdultCount(Math.max(1, adultCount - 1))
                        }
                        disabled={adultCount <= 1}
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold">
                        {adultCount}
                      </span>
                      <button
                        className="w-8 h-8 rounded bg-white border border-emerald-200 text-emerald-700 text-lg font-bold"
                        onClick={() => setAdultCount(adultCount + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* Child Counter */}
                  <div className="flex items-center justify-between bg-yellow-50 rounded-lg p-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-yellow-800">
                        Child (no bed)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 rounded bg-white border border-yellow-200 text-yellow-700 text-lg font-bold disabled:opacity-50"
                        onClick={() =>
                          setChildCount(Math.max(0, childCount - 1))
                        }
                        disabled={childCount <= 0}
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold">
                        {childCount}
                      </span>
                      <button
                        className="w-8 h-8 rounded bg-white border border-yellow-200 text-yellow-700 text-lg font-bold"
                        onClick={() => setChildCount(childCount + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* Infant Counter */}
                  <div className="flex items-center justify-between bg-purple-50 rounded-lg p-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-purple-800">
                        Infant
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 rounded bg-white border border-purple-200 text-purple-700 text-lg font-bold disabled:opacity-50"
                        onClick={() =>
                          setInfantCount(Math.max(0, infantCount - 1))
                        }
                        disabled={infantCount <= 0}
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold">
                        {infantCount}
                      </span>
                      <button
                        className="w-8 h-8 rounded bg-white border border-purple-200 text-purple-700 text-lg font-bold"
                        onClick={() => setInfantCount(infantCount + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* Booking Breakdown */}
                  <div className="bg-emerald-50 rounded-xl p-4 mb-6">
                    <div className="font-semibold text-lg mb-2">
                      Booking Breakdown
                    </div>
                    <div className="mb-1">
                      Adult: {adultCount} × ₹{prices.adult.toLocaleString()} ={" "}
                      <span className="font-bold">
                        ₹{adultTotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="mb-1">
                      Child (no bed): {childCount} × ₹
                      {prices.child.toLocaleString()} ={" "}
                      <span className="font-bold">
                        ₹{childTotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="mb-1">
                      Infant: {infantCount} × ₹{prices.infant.toLocaleString()}{" "}
                      ={" "}
                      <span className="font-bold">
                        ₹{infantTotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-2 font-semibold">
                      Total Travelers:{" "}
                      <span className="font-bold">{totalTravelers}</span>
                    </div>
                    {/* Total Package Cost Row */}
                    <div className="mt-4 bg-green-100 rounded-lg px-6 py-3 flex items-center justify-between">
                      <span className="text-lg font-semibold text-emerald-800">
                        Total Package Cost:
                      </span>
                      <span className="text-2xl font-bold text-emerald-700">
                        ₹
                        {(
                          adultTotal +
                          childTotal +
                          infantTotal
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </>
              )}
              {selectedRoomType === "private" && (
                <>
                  <div className="font-semibold text-base mb-2">
                    Select Number of Rooms
                  </div>
                  {/* Quad Bed */}
                  <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-emerald-700" />
                      <span className="font-semibold text-emerald-900">
                        Quad Bed
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 rounded bg-white border border-emerald-200 text-emerald-700 text-lg font-bold disabled:opacity-50"
                        onClick={() => setQuadCount(Math.max(0, quadCount - 1))}
                        disabled={quadCount <= 0}
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold">
                        {quadCount}
                      </span>
                      <button
                        className="w-8 h-8 rounded bg-white border border-emerald-200 text-emerald-700 text-lg font-bold"
                        onClick={() => setQuadCount(quadCount + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* Triple Bed */}
                  <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-emerald-700" />
                      <span className="font-semibold text-emerald-900">
                        Triple Bed
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 rounded bg-white border border-emerald-200 text-emerald-700 text-lg font-bold disabled:opacity-50"
                        onClick={() =>
                          setTripleCount(Math.max(0, tripleCount - 1))
                        }
                        disabled={tripleCount <= 0}
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold">
                        {tripleCount}
                      </span>
                      <button
                        className="w-8 h-8 rounded bg-white border border-emerald-200 text-emerald-700 text-lg font-bold"
                        onClick={() => setTripleCount(tripleCount + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* Double Bed */}
                  <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-emerald-700" />
                      <span className="font-semibold text-emerald-900">
                        Double Bed
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 rounded bg-white border border-emerald-200 text-emerald-700 text-lg font-bold disabled:opacity-50"
                        onClick={() =>
                          setDoubleCount(Math.max(0, doubleCount - 1))
                        }
                        disabled={doubleCount <= 0}
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold">
                        {doubleCount}
                      </span>
                      <button
                        className="w-8 h-8 rounded bg-white border border-emerald-200 text-emerald-700 text-lg font-bold"
                        onClick={() => setDoubleCount(doubleCount + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* Child (no bed) */}
                  <div className="flex items-center justify-between bg-yellow-50 rounded-lg p-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-yellow-800">
                        Child (no bed)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 rounded bg-white border border-yellow-200 text-yellow-700 text-lg font-bold disabled:opacity-50"
                        onClick={() =>
                          setChildCount(Math.max(0, childCount - 1))
                        }
                        disabled={childCount <= 0}
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold">
                        {childCount}
                      </span>
                      <button
                        className="w-8 h-8 rounded bg-white border border-yellow-200 text-yellow-700 text-lg font-bold"
                        onClick={() => setChildCount(childCount + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* Infant */}
                  <div className="flex items-center justify-between bg-purple-50 rounded-lg p-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-purple-800">
                        Infant
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="w-8 h-8 rounded bg-white border border-purple-200 text-purple-700 text-lg font-bold disabled:opacity-50"
                        onClick={() =>
                          setInfantCount(Math.max(0, infantCount - 1))
                        }
                        disabled={infantCount <= 0}
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold">
                        {infantCount}
                      </span>
                      <button
                        className="w-8 h-8 rounded bg-white border border-purple-200 text-purple-700 text-lg font-bold"
                        onClick={() => setInfantCount(infantCount + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  {/* Booking Breakdown */}
                  <div className="bg-emerald-50 rounded-xl p-4 mb-6">
                    <div className="font-semibold text-lg mb-2">
                      Booking Breakdown
                    </div>
                    <div className="mb-1">
                      Quad Bed: {quadCount} × ₹
                      {privatePrices.quad.toLocaleString()} ={" "}
                      <span className="font-bold">
                        ₹{(quadCount * privatePrices.quad).toLocaleString()}
                      </span>
                    </div>
                    <div className="mb-1">
                      Triple Bed: {tripleCount} × ₹
                      {privatePrices.triple.toLocaleString()} ={" "}
                      <span className="font-bold">
                        ₹{(tripleCount * privatePrices.triple).toLocaleString()}
                      </span>
                    </div>
                    <div className="mb-1">
                      Double Bed: {doubleCount} × ₹
                      {privatePrices.double.toLocaleString()} ={" "}
                      <span className="font-bold">
                        ₹{(doubleCount * privatePrices.double).toLocaleString()}
                      </span>
                    </div>
                    <div className="mb-1">
                      Child (no bed): {childCount} × ₹
                      {privatePrices.child.toLocaleString()} ={" "}
                      <span className="font-bold">
                        ₹{(childCount * privatePrices.child).toLocaleString()}
                      </span>
                    </div>
                    <div className="mb-1">
                      Infant: {infantCount} × ₹{prices.infant.toLocaleString()}{" "}
                      ={" "}
                      <span className="font-bold">
                        ₹{(infantCount * prices.infant).toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-2 font-semibold">
                      Total Rooms:{" "}
                      <span className="font-bold">{totalRooms}</span>
                    </div>
                    <div className="font-semibold">
                      Total Travelers:{" "}
                      <span className="font-bold">
                        {totalTravelersPrivate + infantCount}
                      </span>
                    </div>
                    {/* Total Package Cost Row */}
                    <div className="mt-4 bg-green-100 rounded-lg px-6 py-3 flex items-center justify-between">
                      <span className="text-lg font-semibold text-emerald-800">
                        Total Package Cost:
                      </span>
                      <span className="text-2xl font-bold text-emerald-700">
                        ₹
                        {(
                          privateTotal +
                          infantCount * prices.infant
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </>
              )}
              {/* Book Now Button */}
              <Button
                size="lg"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg text-lg mb-3"
                disabled={
                  selectedRoomType === "" ||
                  (selectedRoomType === "sharing" && adultCount < 1) ||
                  (selectedRoomType === "private" && totalRooms < 1)
                }
              >
                Book This Package Now
              </Button>
              {/* Request Custom Quote Button */}
              <Button
                variant="outline"
                className="w-full border-emerald-600 text-emerald-700 font-semibold py-3 rounded-lg text-lg mb-6"
                onClick={() => setShowQuoteModal(true)}
              >
                Request Custom Quote
              </Button>
              <Dialog open={showQuoteModal} onOpenChange={setShowQuoteModal}>
                <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Request Custom Hajj Quote</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleQuoteSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Full Name
                      </label>
                      <Input
                        value={quoteForm.fullName}
                        onChange={(e) =>
                          handleQuoteChange("fullName", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="w-1/3">
                        <label className="block text-sm font-medium mb-1">
                          Country Code
                        </label>
                        <div className="relative">
                          <Input
                            placeholder="Search country..."
                            value={
                              countrySearch !== ""
                                ? countrySearch
                                : quoteForm.countryCode
                            }
                            onFocus={() => setCountryDropdownOpen(true)}
                            onBlur={() =>
                              setTimeout(
                                () => setCountryDropdownOpen(false),
                                100,
                              )
                            }
                            onChange={(e) => {
                              setCountrySearch(e.target.value);
                              setCountryDropdownOpen(true);
                            }}
                            className="mb-1"
                          />

                          {countryDropdownOpen && (
                            <div className="absolute z-50 bg-white border border-gray-200 rounded shadow w-full max-h-48 overflow-y-auto mt-1">
                              {filteredCountryCodes.length === 0 && (
                                <div className="px-3 py-2 text-gray-500">
                                  No results
                                </div>
                              )}
                              {filteredCountryCodes.map((c) => (
                                <div
                                  key={c.code}
                                  className="px-3 py-2 hover:bg-emerald-50 cursor-pointer"
                                  onClick={() => {
                                    handleQuoteChange("countryCode", c.code);
                                    setCountrySearch(""); // Clear search input after selection
                                    setCountryDropdownOpen(false);
                                  }}
                                >
                                  {c.name} ({c.code})
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">
                          Mobile Number
                        </label>
                        <Input
                          value={quoteForm.mobile}
                          onChange={(e) =>
                            handleQuoteChange("mobile", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-1/2">
                        <label className="block text-sm font-medium mb-1">
                          Maktab Category
                        </label>
                        <Select
                          value={quoteForm.maktabCategory}
                          onValueChange={(v) =>
                            handleQuoteChange("maktabCategory", v)
                          }
                          required
                        >
                          <SelectTrigger>
                            {quoteForm.maktabCategory || "Select"}
                          </SelectTrigger>
                          <SelectContent>
                            {maktabCategories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-1/2">
                        <label className="block text-sm font-medium mb-1">
                          Accommodation Type
                        </label>
                        <Select
                          value={quoteForm.accommodationType}
                          onValueChange={(v) =>
                            handleQuoteChange("accommodationType", v)
                          }
                          required
                        >
                          <SelectTrigger>
                            {quoteForm.accommodationType || "Select"}
                          </SelectTrigger>
                          <SelectContent>
                            {accommodationTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-1/3">
                        <label className="block text-sm font-medium mb-1">
                          Adults
                        </label>
                        <Input
                          type="number"
                          min={1}
                          value={quoteForm.adultCount}
                          onChange={(e) =>
                            handleQuoteChange(
                              "adultCount",
                              Number(e.target.value),
                            )
                          }
                          required
                        />
                      </div>
                      <div className="w-1/3">
                        <label className="block text-sm font-medium mb-1">
                          Children
                        </label>
                        <Input
                          type="number"
                          min={0}
                          value={quoteForm.childCount}
                          onChange={(e) =>
                            handleQuoteChange(
                              "childCount",
                              Number(e.target.value),
                            )
                          }
                          required
                        />
                      </div>
                      <div className="w-1/3">
                        <label className="block text-sm font-medium mb-1">
                          Infants
                        </label>
                        <Input
                          type="number"
                          min={0}
                          value={quoteForm.infantCount}
                          onChange={(e) =>
                            handleQuoteChange(
                              "infantCount",
                              Number(e.target.value),
                            )
                          }
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Departure City
                      </label>
                      <Input
                        value={quoteForm.departureCity}
                        onChange={(e) =>
                          handleQuoteChange("departureCity", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="w-1/2">
                        <label className="block text-sm font-medium mb-1">
                          Duration Category
                        </label>
                        <Select
                          value={quoteForm.durationCategory}
                          onValueChange={(v) =>
                            handleQuoteChange("durationCategory", v)
                          }
                          required
                        >
                          <SelectTrigger>
                            {durationCategories.find(
                              (cat) => cat.value === quoteForm.durationCategory,
                            )?.label || "Select"}
                          </SelectTrigger>
                          <SelectContent>
                            {durationCategories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value}>
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-1/2">
                        <label className="block text-sm font-medium mb-1">
                          Package Class
                        </label>
                        <Select
                          value={quoteForm.packageClass}
                          onValueChange={(v) =>
                            handleQuoteChange("packageClass", v)
                          }
                          required
                        >
                          <SelectTrigger>
                            {quoteForm.packageClass || "Select"}
                          </SelectTrigger>
                          <SelectContent>
                            {packageClasses.map((cls) => (
                              <SelectItem key={cls} value={cls}>
                                {cls}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter className="mt-4">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setShowQuoteModal(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-emerald-600 text-white"
                      >
                        Submit Request
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              <hr className="my-6 border-gray-200" />
              {/* Need Assistance Section */}
              <div>
                <div className="text-lg font-semibold text-gray-900 mb-4">
                  Need Assistance?
                </div>
                <div className="flex items-center gap-3 bg-emerald-50 rounded-lg p-4 mb-3">
                  <Phone className="w-6 h-6 text-emerald-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Call Us</div>
                    <div className="text-gray-700 text-base">
                      +91-78920-09800
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-emerald-50 rounded-lg p-4">
                  <Mail className="w-6 h-6 text-emerald-600" />
                  <div>
                    <div className="font-semibold text-gray-900">Email Us</div>
                    <div className="text-gray-700 text-base">
                      support@marhabahaji.com
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HajjPackageDetail;
