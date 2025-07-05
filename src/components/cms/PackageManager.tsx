import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DatabasePackage {
  id?: string;
  name: string;
  description: string | null;
  duration: string;
  price: number;
  status: "draft" | "active" | "inactive";
  category: string | null;
  category_id: string | null;
  inclusions: string[] | null;
  exclusions: string[] | null;
  images: string[] | null;
  featured_image: string | null;
  makkah_hotel: { id: string; name: string } | null;
  makkah_hotel_id: string | null;
  madinah_hotel: { id: string; name: string } | null;
  madinah_hotel_id: string | null;
  flight_details: {
    departure_from_airport?: string;
    return_from_airport?: string;
    airline_name?: string;
    flight_type?: string;
  } | null;
  itinerary: Array<{ title: string; description: string }> | null;
  pricing: Record<string, unknown> | null;
  room_type_pricing: {
    single: number | null;
    double: number | null;
    triple: number | null;
  } | null;
  max_capacity: number | null;
  available_spots: number | null;
  departure_date: string | null;
  return_date: string | null;
  booking_deadline: string | null;
  is_group_package: boolean | null;
  min_participants: number | null;
  activities: string[] | null;
  cities_covered: string[] | null;
  flight_included: boolean | null;
  season_category: string | null;
  terms_conditions: string | null;
  meal_plan: string | null;
  package_category: string | null;
  package_type: string | null;
  meta_title?: string;
  meta_description?: string;
  target_keywords?: string[];
  page_schema?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  slug?: string;
  airline_name?: string;
  flight_type?: string;
  departure_from_airport?: string;
  return_from_airport?: string;
  seo?: {
    meta_title?: string;
    meta_description?: string;
    target_keywords?: string[];
    page_schema?: string;
    og_title?: string;
    og_description?: string;
    og_image?: string;
    slug?: string;
  };
  hotels: {
    makkah_hotel_id: string | null;
    madinah_hotel_id: string | null;
  };
  currency?: string;
}

interface FormPackage extends Omit<DatabasePackage, "id" | "status"> {
  status: "draft" | "published" | "archived";
}

const Dropdown = ({
  label,
  id,
  value,
  onChange,
  options,
  loading,
  required = false,
  multiple = false,
  error,
  helper,
}) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <select
      id={id}
      value={value}
      onChange={onChange}
      required={required}
      multiple={multiple}
      className={error ? "border-red-500" : ""}
    >
      {!multiple && <option value="">Select {label.toLowerCase()}</option>}
      {loading ? (
        <option>Loading...</option>
      ) : (
        options.map((opt) => (
          <option key={opt.id} value={opt.id}>
            {opt.name}
          </option>
        ))
      )}
    </select>
    {helper && <div className="text-xs text-gray-500">{helper}</div>}
    {error && <span className="text-red-500 text-xs">{error}</span>}
  </div>
);

const FileUpload = ({
  label,
  id,
  onChange,
  disabled,
  multiple = false,
  previewUrls = [],
  uploading,
  helper,
}) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <input
      id={id}
      type="file"
      accept="image/*"
      onChange={onChange}
      disabled={disabled}
      multiple={multiple}
    />
    {uploading && <span className="text-xs text-blue-500">Uploading...</span>}
    {helper && <div className="text-xs text-gray-500">{helper}</div>}
    {previewUrls && previewUrls.length > 0 && (
      <div className="flex gap-2 mt-2 flex-wrap">
        {previewUrls.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`Image ${idx + 1}`}
            className="h-16 rounded"
          />
        ))}
      </div>
    )}
  </div>
);

const PackageManager = () => {
  const [packages, setPackages] = useState<DatabasePackage[]>([]);
  const [editingPackage, setEditingPackage] = useState<DatabasePackage | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [hotels, setHotels] = useState<{ id: string; name: string }[]>([]);
  const [activitiesList, setActivitiesList] = useState<
    { id: string; name: string }[]
  >([]);

  const [formData, setFormData] = useState<FormPackage>({
    name: "",
    description: "",
    duration: "",
    price: 0,
    status: "draft",
    category: "",
    category_id: "",
    inclusions: [],
    exclusions: [],
    images: [],
    featured_image: "",
    makkah_hotel: null,
    makkah_hotel_id: "",
    madinah_hotel: null,
    madinah_hotel_id: "",
    flight_details: null,
    itinerary: [],
    pricing: {},
    room_type_pricing: null,
    max_capacity: null,
    available_spots: null,
    departure_date: "",
    return_date: "",
    booking_deadline: "",
    is_group_package: false,
    min_participants: null,
    activities: [],
    cities_covered: [],
    flight_included: false,
    season_category: "",
    terms_conditions: "",
    meal_plan: "",
    package_category: "",
    package_type: "",
    meta_title: "",
    meta_description: "",
    target_keywords: [],
    page_schema: "",
    og_title: "",
    og_description: "",
    og_image: "",
    slug: "",
    airline_name: "",
    flight_type: "",
    departure_from_airport: "",
    return_from_airport: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [hotelsLoading, setHotelsLoading] = useState(false);
  const [activitiesLoading, setActivitiesLoading] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const [activeTab, setActiveTab] = useState("form");

  const [slugError, setSlugError] = useState("");
  const [slugChecking, setSlugChecking] = useState(false);

  // Meal Plan dropdown options
  const mealPlanOptions = [
    "Room Only",
    "Breakfast",
    "Half board",
    "Full board",
  ];
  // Package Category dropdown options
  const packageCategoryOptions = [
    "Saver",
    "Budget",
    "Economy",
    "Economy Plus",
    "Standard",
    "Deluxe",
    "Super Deluxe",
    "Premium",
    "Hilton",
    "Luxury",
  ];

  // Islamic months + December for season category
  const seasonCategoryOptions = [
    "Muharram",
    "Safar",
    "Rabi al-Awwal",
    "Rabi al-Thani",
    "Jumada al-Awwal",
    "Jumada al-Thani",
    "Rajab",
    "Sha'ban",
    "Ramadan",
    "Shawwal",
    "Dhu al-Qadah",
    "Dhu al-Hijjah",
    "December",
  ];

  // Date helpers
  const today = new Date();
  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  const formatDate = (date: Date) => date.toISOString().split("T")[0];
  const minDepartureDate = formatDate(addDays(today, 3));
  const minReturnDate = formData.departure_date
    ? formatDate(addDays(new Date(formData.departure_date), 1))
    : minDepartureDate;
  const maxBookingDeadline = formData.departure_date
    ? formatDate(addDays(new Date(formData.departure_date), -1))
    : minDepartureDate;

  useEffect(() => {
    fetchPackages();
    fetchCategories();
    fetchHotels();
    fetchActivities();
  }, []);

  useEffect(() => {
    if (!slugManuallyEdited) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(
          prev.meta_title || prev.name,
          prev.target_keywords || [],
        ),
      }));
    }
    // eslint-disable-next-line
  }, [formData.meta_title, formData.name, formData.target_keywords]);

  // Automate flight_included based on flight details
  useEffect(() => {
    const hasFlightDetails = !!(
      formData.airline_name?.trim() ||
      formData.flight_type?.trim() ||
      formData.departure_from_airport?.trim() ||
      formData.return_from_airport?.trim()
    );

    if (hasFlightDetails !== formData.flight_included) {
      setFormData((prev) => ({
        ...prev,
        flight_included: hasFlightDetails,
      }));
    }
  }, [
    formData.airline_name,
    formData.flight_type,
    formData.departure_from_airport,
    formData.return_from_airport,
  ]);

  const fetchPackages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("umrah_packages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast({
        title: "Error",
        description: "Failed to fetch packages",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("id, name")
      .eq("is_active", true)
      .order("name");
    if (!error && data) setCategories(data);
    setCategoriesLoading(false);
  };

  const fetchHotels = async () => {
    setHotelsLoading(true);
    const { data, error } = await supabase
      .from("hotels")
      .select("id, name")
      .eq("is_active", true)
      .order("name");
    if (!error && data) setHotels(data);
    setHotelsLoading(false);
  };

  const fetchActivities = async () => {
    setActivitiesLoading(true);
    const { data, error } = await supabase
      .from("activities")
      .select("id, name")
      .order("name");
    if (!error && data) setActivitiesList(data);
    setActivitiesLoading(false);
  };

  const handleInputChange = (field: keyof FormPackage, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const convertFormToDatabase = (
    formPackage: FormPackage,
  ): Omit<DatabasePackage, "id"> => {
    const statusMap: Record<FormPackage["status"], DatabasePackage["status"]> =
      {
        draft: "draft",
        published: "active",
        archived: "inactive",
      };

    // Combine flight fields into flight_details JSON object
    const flight_details = {
      departure_from_airport: formPackage.departure_from_airport,
      return_from_airport: formPackage.return_from_airport,
      airline_name: formPackage.airline_name,
      flight_type: formPackage.flight_type,
    };

    // Combine hotel fields as objects (if needed)
    const makkah_hotel = formPackage.makkah_hotel;
    const madinah_hotel = formPackage.madinah_hotel;

    // Combine SEO fields into seo
    const seo = {
      ...(formPackage.seo && typeof formPackage.seo === "object"
        ? formPackage.seo
        : {}),
      slug: formPackage.slug,
      meta_title: formPackage.meta_title,
      meta_description: formPackage.meta_description,
      target_keywords: formPackage.target_keywords,
      page_schema: formPackage.page_schema,
      og_title: formPackage.og_title,
      og_description: formPackage.og_description,
      og_image: formPackage.og_image,
    };

    // Combine hotel fields into hotels
    const hotels =
      formPackage.hotels && typeof formPackage.hotels === "object"
        ? formPackage.hotels
        : {};

    // Combine room type pricing fields into room_type_pricing
    const room_type_pricing = {
      single: formPackage.room_type_pricing?.single,
      double: formPackage.room_type_pricing?.double,
      triple: formPackage.room_type_pricing?.triple,
      // Add more as needed
    };

    // Ensure itinerary is an array of {title, description}
    const itinerary = Array.isArray(formPackage.itinerary)
      ? formPackage.itinerary
      : Object.entries(formPackage.itinerary || {}).map(
          ([title, description]) => ({ title, description }),
        );

    // Remove legacy fields from root
    const {
      airline_name,
      flight_type,
      departure_from_airport,
      return_from_airport,
      meta_title,
      meta_description,
      target_keywords,
      page_schema,
      og_title,
      og_description,
      og_image,
      slug,
      makkah_hotel_id,
      madinah_hotel_id,
      room_type_pricing: _room_type_pricing,
      mealPlan,
      packageCategory,
      packageType,
      includes,
      ...rest
    } = formPackage;

    return {
      ...rest,
      status: statusMap[formPackage.status],
      season_category: formPackage.season_category,
      flight_details,
      makkah_hotel,
      madinah_hotel,
      seo,
      hotels,
      room_type_pricing,
      itinerary,
    };
  };

  const convertDatabaseToForm = (dbPackage: DatabasePackage): FormPackage => {
    const statusMap: Record<DatabasePackage["status"], FormPackage["status"]> =
      {
        draft: "draft",
        active: "published",
        inactive: "archived",
      };

    const flight = dbPackage.flight_details || {};
    const seo = dbPackage.seo || {};
    const hotels = dbPackage.hotels || {};
    const roomTypePricing = dbPackage.room_type_pricing || {};
    const pricing = dbPackage.pricing || {};

    return {
      ...dbPackage,
      status: statusMap[dbPackage.status],
      season_category: dbPackage.season_category || "",
      airline_name: flight.airline_name || "",
      flight_type: flight.flight_type || "",
      departure_from_airport: flight.departure_from_airport || "",
      return_from_airport: flight.return_from_airport || "",
      meta_title: seo.meta_title || "",
      meta_description: seo.meta_description || "",
      target_keywords: seo.target_keywords || [],
      page_schema: seo.page_schema || "",
      og_title: seo.og_title || "",
      og_description: seo.og_description || "",
      og_image: seo.og_image || "",
      slug: seo.slug || "",
      makkah_hotel_id: hotels.makkah_hotel_id || "",
      madinah_hotel_id: hotels.madinah_hotel_id || "",
      pricing: pricing,
      room_type_pricing: {
        single: roomTypePricing.single || null,
        double: roomTypePricing.double || null,
        triple: roomTypePricing.triple || null,
        // Add more as needed
      },
    };
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Package name is required.";
    if (!formData.duration) newErrors.duration = "Duration is required.";
    if (!formData.price || isNaN(formData.price))
      newErrors.price = "Price is required.";
    if (!formData.category_id) newErrors.category_id = "Category is required.";
    // Add more validations as needed
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper to stringify objects with sorted keys for stable comparison
  function stableStringify(obj) {
    if (obj && typeof obj === "object" && !Array.isArray(obj)) {
      return JSON.stringify(
        Object.keys(obj)
          .sort()
          .reduce((acc, key) => {
            acc[key] = obj[key];
            return acc;
          }, {}),
      );
    }
    return JSON.stringify(obj);
  }

  // Real-time slug uniqueness check
  const checkSlugUnique = async (slug) => {
    if (!slug) {
      setSlugError("Slug cannot be empty.");
      return;
    }
    setSlugChecking(true);
    const { data, error } = await supabase
      .from("umrah_packages")
      .select("id")
      .eq("seo->slug", slug);
    setSlugChecking(false);
    // Exclude current package if editing
    const isDuplicate =
      data && data.some((row) => row.id !== editingPackage?.id);
    if (isDuplicate) {
      setSlugError("This slug is already in use. Please choose another.");
    } else {
      setSlugError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || slugError) return;
    setIsLoading(true);
    try {
      const dbData = convertFormToDatabase(formData);
      if (editingPackage?.id) {
        const { error, data } = await supabase
          .from("umrah_packages")
          .update(dbData)
          .eq("id", editingPackage.id)
          .select();

        if (error) {
          toast({
            title: "Error",
            description: `Update failed: ${error.message}`,
            variant: "destructive",
          });
          return;
        }

        // --- Automated field update check ---
        const dbKeys = Object.keys(data[0]);
        const updateKeys = Object.keys(dbData);

        const missingInDB = [];
        const unchangedFields = [];
        const typeMismatches = [];

        for (const key of updateKeys) {
          if (!dbKeys.includes(key)) {
            missingInDB.push(key);
          } else if (
            stableStringify(dbData[key]) !== stableStringify(data[0][key])
          ) {
            unchangedFields.push({
              field: key,
              sent: dbData[key],
              inDB: data[0][key],
              sentType: typeof dbData[key],
              dbType: typeof data[0][key],
            });
            if (typeof dbData[key] !== typeof data[0][key]) {
              typeMismatches.push(key);
            }
          }
        }

        if (missingInDB.length > 0) {
          console.warn(
            "Fields in update object but missing in DB row:",
            missingInDB,
          );
        }
        if (unchangedFields.length > 0) {
          console.warn("Fields present but did not update:", unchangedFields);
        }
        if (typeMismatches.length > 0) {
          console.warn("Type mismatches:", typeMismatches);
        }

        toast({
          title: "Success",
          description: "Package updated successfully!",
          variant: "default",
        });
      } else {
        const { error } = await supabase
          .from("umrah_packages")
          .insert([dbData]);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Package created successfully!",
          variant: "default",
        });
      }
      resetForm();
      fetchPackages();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save package",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      duration: "",
      price: 0,
      status: "draft",
      category: "",
      category_id: "",
      inclusions: [],
      exclusions: [],
      images: [],
      featured_image: "",
      makkah_hotel: null,
      makkah_hotel_id: "",
      madinah_hotel: null,
      madinah_hotel_id: "",
      flight_details: null,
      itinerary: [],
      pricing: {},
      room_type_pricing: null,
      max_capacity: null,
      available_spots: null,
      departure_date: "",
      return_date: "",
      booking_deadline: "",
      is_group_package: false,
      min_participants: null,
      activities: [],
      cities_covered: [],
      flight_included: false,
      season_category: "",
      terms_conditions: "",
      meal_plan: "",
      package_category: "",
      package_type: "",
      meta_title: "",
      meta_description: "",
      target_keywords: [],
      page_schema: "",
      og_title: "",
      og_description: "",
      og_image: "",
      slug: "",
      airline_name: "",
      flight_type: "",
      departure_from_airport: "",
      return_from_airport: "",
    });
    setEditingPackage(null);
    setActiveTab("form");
  };

  const handleEdit = (pkg: DatabasePackage) => {
    setEditingPackage(pkg);
    setFormData({
      ...convertDatabaseToForm(pkg),
      makkah_hotel_id: pkg.makkah_hotel?.id || "",
      madinah_hotel_id: pkg.madinah_hotel?.id || "",
    });
    setActiveTab("form");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      const { error } = await supabase
        .from("umrah_packages")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Package deleted successfully",
      });
      fetchPackages();
    } catch (error) {
      console.error("Error deleting package:", error);
      toast({
        title: "Error",
        description: "Failed to delete package",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "featured_image" | "images",
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      if (field === "featured_image") {
        const file = files[0];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-featured.${fileExt}`;
        const { error } = await supabase.storage
          .from("package-images")
          .upload(fileName, file, { upsert: true });
        if (error) throw error;
        const { data: publicUrlData } = supabase.storage
          .from("package-images")
          .getPublicUrl(fileName);
        console.log("Featured image public URL:", publicUrlData?.publicUrl);
        if (publicUrlData?.publicUrl) {
          setFormData((prev) => ({
            ...prev,
            featured_image: publicUrlData.publicUrl,
          }));
        }
      } else {
        const urls: string[] = [];
        for (const file of Array.from(files)) {
          const fileExt = file.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
          const { error } = await supabase.storage
            .from("package-images")
            .upload(fileName, file, { upsert: true });
          if (error) throw error;
          const { data: publicUrlData } = supabase.storage
            .from("package-images")
            .getPublicUrl(fileName);
          console.log("Image public URL:", publicUrlData?.publicUrl);
          if (publicUrlData?.publicUrl) urls.push(publicUrlData.publicUrl);
        }
        setFormData((prev) => ({ ...prev, images: urls }));
      }
    } catch (err) {
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleOgImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const file = files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-og.${fileExt}`;
      const { error } = await supabase.storage
        .from("package-images")
        .upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data: publicUrlData } = supabase.storage
        .from("package-images")
        .getPublicUrl(fileName);
      console.log("OG image public URL:", publicUrlData?.publicUrl);
      if (publicUrlData?.publicUrl) {
        setFormData((prev) => ({ ...prev, og_image: publicUrlData.publicUrl }));
      }
    } catch (err) {
      alert("OG image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const generateSlug = (title: string, keywords: string[]) => {
    let base = title || "";
    if (keywords && keywords.length > 0) base += "-" + keywords[0];
    return base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Helper to get currency symbol
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

  // Helper to safely display number input values
  const safeNumberInputValue = (val: unknown) => {
    if (typeof val === "number") return val;
    if (typeof val === "string") return parseFloat(val) || 0;
    return 0;
  };

  // Handler to update both makkah_hotel_id and makkah_hotel JSON object
  const handleMakkahHotelChange = (selectedHotelId) => {
    const selectedHotel = hotels.find((h) => h.id === selectedHotelId);
    setFormData((prev) => ({
      ...prev,
      makkah_hotel_id: selectedHotelId,
      makkah_hotel: selectedHotel
        ? { id: selectedHotel.id, name: selectedHotel.name }
        : null,
    }));
  };

  // Handler to update both madinah_hotel_id and madinah_hotel JSON object
  const handleMadinahHotelChange = (selectedHotelId) => {
    const selectedHotel = hotels.find((h) => h.id === selectedHotelId);
    setFormData((prev) => ({
      ...prev,
      madinah_hotel_id: selectedHotelId,
      madinah_hotel: selectedHotel
        ? { id: selectedHotel.id, name: selectedHotel.name }
        : null,
    }));
  };

  // Handle flight_included checkbox manually (override automation if needed)
  const handleFlightIncludedChange = (checked: boolean) => {
    if (!checked) {
      // If unchecking, clear all flight details
      setFormData((prev) => ({
        ...prev,
        flight_included: false,
        airline_name: "",
        flight_type: "",
        departure_from_airport: "",
        return_from_airport: "",
      }));
    } else {
      // If checking, just set to true (will be overridden by useEffect if no details)
      setFormData((prev) => ({
        ...prev,
        flight_included: true,
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Package Manager</h2>
        <Button onClick={resetForm}>Add New Package</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="form">Package Form</TabsTrigger>
          <TabsTrigger value="list">Package List</TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <Card>
            <CardHeader>
              <CardTitle>
                {editingPackage ? "Edit Package" : "Create New Package"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Info */}
                <section>
                  <h3 className="font-semibold mb-2">Basic Info</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* name, description, duration, price, status */}
                    <div>
                      <Label htmlFor="name">Package Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        required
                      />
                      {errors.name && (
                        <span className="text-red-500 text-xs">
                          {errors.name}
                        </span>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Input
                        id="duration"
                        value={formData.duration}
                        onChange={(e) =>
                          handleInputChange("duration", e.target.value)
                        }
                        required
                      />
                      {errors.duration && (
                        <span className="text-red-500 text-xs">
                          {errors.duration}
                        </span>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        type="number"
                        value={safeNumberInputValue(formData.price)}
                        onChange={(e) => {
                          const value = e.target.value;
                          const parsed = value ? parseFloat(value) : 0;
                          handleInputChange(
                            "price",
                            isNaN(parsed) ? 0 : parsed,
                          );
                        }}
                        required
                      />
                      {errors.price && (
                        <span className="text-red-500 text-xs">
                          {errors.price}
                        </span>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          handleInputChange("status", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description || ""}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        rows={3}
                      />
                    </div>
                  </div>
                </section>

                {/* Hotels */}
                <section>
                  <h3 className="font-semibold mb-2">Hotels</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="makkah_hotel_id">Makkah Hotel</Label>
                      <select
                        id="makkah_hotel_id"
                        value={formData.makkah_hotel?.id || ""}
                        onChange={(e) =>
                          handleMakkahHotelChange(e.target.value)
                        }
                      >
                        <option value="">Select hotel</option>
                        {hotelsLoading ? (
                          <option>Loading...</option>
                        ) : (
                          hotels.map((h) => (
                            <option key={h.id} value={h.id}>
                              {h.name}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="madinah_hotel_id">Madinah Hotel</Label>
                      <select
                        id="madinah_hotel_id"
                        value={formData.madinah_hotel?.id || ""}
                        onChange={(e) =>
                          handleMadinahHotelChange(e.target.value)
                        }
                      >
                        <option value="">Select hotel</option>
                        {hotelsLoading ? (
                          <option>Loading...</option>
                        ) : (
                          hotels.map((h) => (
                            <option key={h.id} value={h.id}>
                              {h.name}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>
                </section>

                {/* Departure From Airport */}
                <section>
                  <h3 className="font-semibold mb-2">Departure From Airport</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="departure_from_airport">
                        Departure From Airport
                      </Label>
                      <Input
                        id="departure_from_airport"
                        value={formData.departure_from_airport || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            departure_from_airport: e.target.value,
                          }))
                        }
                        placeholder="Enter departure airport name or code"
                      />
                    </div>
                  </div>
                </section>

                {/* Return From Airport */}
                <section>
                  <h3 className="font-semibold mb-2">Return From Airport</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="return_from_airport">
                        Return From Airport
                      </Label>
                      <select
                        id="return_from_airport"
                        value={formData.return_from_airport || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            return_from_airport: e.target.value,
                          }))
                        }
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="">Select airport</option>
                        <option value="Jeddah">Jeddah</option>
                        <option value="Madinah">Madinah</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* Dates */}
                <section>
                  <h3 className="font-semibold mb-2">Dates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="departure_date">Departure Date</Label>
                      <Input
                        id="departure_date"
                        type="date"
                        value={formData.departure_date || ""}
                        min={minDepartureDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            departure_date: e.target.value,
                            return_date: "",
                            booking_deadline: "",
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="return_date">Return Date</Label>
                      <Input
                        id="return_date"
                        type="date"
                        value={formData.return_date || ""}
                        min={minReturnDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            return_date: e.target.value,
                          }))
                        }
                        disabled={!formData.departure_date}
                      />
                    </div>
                    <div>
                      <Label htmlFor="booking_deadline">Booking Deadline</Label>
                      <Input
                        id="booking_deadline"
                        type="date"
                        value={formData.booking_deadline || ""}
                        max={maxBookingDeadline}
                        min={formatDate(today)}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            booking_deadline: e.target.value,
                          }))
                        }
                        disabled={!formData.departure_date}
                      />
                    </div>
                  </div>
                </section>

                {/* Capacity */}
                <section>
                  <h3 className="font-semibold mb-2">Capacity</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="max_capacity">Max Capacity</Label>
                      <Input
                        id="max_capacity"
                        type="number"
                        value={safeNumberInputValue(formData.max_capacity)}
                        onChange={(e) => {
                          const value = e.target.value;
                          const parsed = value ? parseInt(value, 10) : null;
                          handleInputChange(
                            "max_capacity",
                            isNaN(parsed) ? null : parsed,
                          );
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="available_spots">Available Spots</Label>
                      <Input
                        id="available_spots"
                        type="number"
                        value={safeNumberInputValue(formData.available_spots)}
                        onChange={(e) => {
                          const value = e.target.value;
                          const parsed = value ? parseInt(value, 10) : null;
                          handleInputChange(
                            "available_spots",
                            isNaN(parsed) ? null : parsed,
                          );
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor="is_group_package">Is Group Package</Label>
                      <input
                        id="is_group_package"
                        type="checkbox"
                        checked={!!formData.is_group_package}
                        onChange={(e) =>
                          handleInputChange(
                            "is_group_package",
                            e.target.checked,
                          )
                        }
                      />
                    </div>
                    {formData.is_group_package && (
                      <div>
                        <Label htmlFor="min_participants">
                          Min Participants
                        </Label>
                        <Input
                          id="min_participants"
                          type="number"
                          value={safeNumberInputValue(
                            formData.min_participants,
                          )}
                          onChange={(e) => {
                            const value = e.target.value;
                            const parsed = value ? parseInt(value, 10) : null;
                            handleInputChange(
                              "min_participants",
                              isNaN(parsed) ? null : parsed,
                            );
                          }}
                        />
                        <div className="text-xs text-gray-500">
                          Only required for group packages
                        </div>
                      </div>
                    )}
                  </div>
                </section>

                {/* Images */}
                <section>
                  <h3 className="font-semibold mb-2">Images</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="featured_image">Featured Image</Label>
                      <FileUpload
                        label="Featured Image"
                        id="featured_image"
                        onChange={(e) => handleImageUpload(e, "featured_image")}
                        disabled={uploading}
                        previewUrls={
                          formData.featured_image
                            ? [formData.featured_image]
                            : []
                        }
                        uploading={uploading}
                        helper="Upload a main image for this package."
                      />
                    </div>
                    <div>
                      <Label htmlFor="images">Images</Label>
                      <FileUpload
                        label="Images"
                        id="images"
                        onChange={(e) => handleImageUpload(e, "images")}
                        disabled={uploading}
                        multiple
                        previewUrls={formData.images || []}
                        uploading={uploading}
                        helper="You can upload multiple images."
                      />
                    </div>
                  </div>
                </section>

                {/* Pricing */}
                <section>
                  <h3 className="font-semibold mb-2">Pricing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Sharing Room */}
                    <div>
                      <h4 className="font-semibold mb-2">Sharing Room</h4>
                      <div className="mb-2">
                        <Label htmlFor="price_sharing">
                          Price per Traveler
                        </Label>
                        <Input
                          id="price_sharing"
                          type="number"
                          min="0"
                          value={safeNumberInputValue(
                            formData.pricing?.sharing?.pricePerTraveler,
                          )}
                          onChange={(e) => {
                            const value = e.target.value;
                            const parsed = value ? parseFloat(value) : null;
                            setFormData((prev) => ({
                              ...prev,
                              pricing: {
                                ...prev.pricing,
                                sharing: {
                                  pricePerTraveler: isNaN(parsed)
                                    ? null
                                    : parsed,
                                },
                                private: prev.pricing?.private || {},
                                childWithoutBed:
                                  prev.pricing?.childWithoutBed || null,
                                infant: prev.pricing?.infant || null,
                              },
                            }));
                          }}
                          placeholder="Price per traveler"
                        />
                      </div>
                    </div>
                    {/* Private Room */}
                    <div>
                      <h4 className="font-semibold mb-2">
                        Private Room (per room)
                      </h4>
                      {["quint", "quad", "triple", "double", "single"].map(
                        (type) => (
                          <div className="mb-2" key={type}>
                            <Label htmlFor={`price_${type}`}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
                              Room Price
                            </Label>
                            <Input
                              id={`price_${type}`}
                              type="number"
                              min="0"
                              value={safeNumberInputValue(
                                formData.pricing?.private?.[type],
                              )}
                              onChange={(e) => {
                                const value = e.target.value;
                                const parsed = value ? parseFloat(value) : null;
                                setFormData((prev) => ({
                                  ...prev,
                                  pricing: {
                                    ...prev.pricing,
                                    sharing: prev.pricing?.sharing || {},
                                    private: {
                                      ...prev.pricing?.private,
                                      [type]: isNaN(parsed) ? null : parsed,
                                    },
                                    childWithoutBed:
                                      prev.pricing?.childWithoutBed || null,
                                    infant: prev.pricing?.infant || null,
                                  },
                                }));
                              }}
                              placeholder={`${type.charAt(0).toUpperCase() + type.slice(1)} room price`}
                            />
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                  {/* Child Without Bed & Infant */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                    <div>
                      <Label htmlFor="price_childWithoutBed">
                        Child Without Bed Price
                      </Label>
                      <Input
                        id="price_childWithoutBed"
                        type="number"
                        min="0"
                        value={safeNumberInputValue(
                          formData.pricing?.childWithoutBed,
                        )}
                        onChange={(e) => {
                          const value = e.target.value;
                          const parsed = value ? parseFloat(value) : null;
                          setFormData((prev) => ({
                            ...prev,
                            pricing: {
                              ...prev.pricing,
                              childWithoutBed: isNaN(parsed) ? null : parsed,
                              sharing: prev.pricing?.sharing || {},
                              private: prev.pricing?.private || {},
                              infant: prev.pricing?.infant || null,
                            },
                          }));
                        }}
                        placeholder="Child without bed price"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price_infant">Infant Price</Label>
                      <Input
                        id="price_infant"
                        type="number"
                        min="0"
                        value={safeNumberInputValue(formData.pricing?.infant)}
                        onChange={(e) => {
                          const value = e.target.value;
                          const parsed = value ? parseFloat(value) : null;
                          setFormData((prev) => ({
                            ...prev,
                            pricing: {
                              ...prev.pricing,
                              infant: isNaN(parsed) ? null : parsed,
                              sharing: prev.pricing?.sharing || {},
                              private: prev.pricing?.private || {},
                              childWithoutBed:
                                prev.pricing?.childWithoutBed || null,
                            },
                          }));
                        }}
                        placeholder="Infant price"
                      />
                    </div>
                  </div>
                </section>

                {/* Advanced Options */}
                <section>
                  <h3 className="font-semibold mb-2">Advanced Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category_id">Category</Label>
                      <select
                        id="category_id"
                        value={formData.category_id || ""}
                        onChange={(e) =>
                          handleInputChange("category_id", e.target.value)
                        }
                        required
                      >
                        <option value="">Select category</option>
                        {categoriesLoading ? (
                          <option>Loading...</option>
                        ) : (
                          categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))
                        )}
                      </select>
                      {errors.category_id && (
                        <span className="text-red-500 text-xs">
                          {errors.category_id}
                        </span>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="activities">Activities</Label>
                      <Dropdown
                        label="Activities"
                        id="activities"
                        value={formData.activities || []}
                        onChange={(e) =>
                          handleInputChange(
                            "activities",
                            Array.from(
                              e.target.selectedOptions,
                              (o) => o.value,
                            ),
                          )
                        }
                        options={activitiesList}
                        loading={activitiesLoading}
                        multiple
                        helper="Hold Ctrl or Cmd to select multiple"
                      />
                    </div>
                    <div>
                      <Label htmlFor="inclusions">
                        Inclusions (comma separated)
                      </Label>
                      <Input
                        id="inclusions"
                        value={formData.inclusions?.join(",") || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "inclusions",
                            e.target.value.split(","),
                          )
                        }
                      />
                      <div className="text-xs text-gray-500">
                        Comma separated values
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="exclusions">
                        Exclusions (comma separated)
                      </Label>
                      <Input
                        id="exclusions"
                        value={formData.exclusions?.join(",") || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "exclusions",
                            e.target.value.split(","),
                          )
                        }
                      />
                      <div className="text-xs text-gray-500">
                        Comma separated values
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="cities_covered">
                        Cities Covered (comma separated)
                      </Label>
                      <Input
                        id="cities_covered"
                        value={formData.cities_covered?.join(",") || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "cities_covered",
                            e.target.value.split(","),
                          )
                        }
                      />
                      <div className="text-xs text-gray-500">
                        Comma separated values
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="season_category">Season Category</Label>
                      <select
                        id="season_category"
                        value={formData.season_category || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            season_category: e.target.value,
                          }))
                        }
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="">Select season</option>
                        {seasonCategoryOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="terms_conditions">
                        Terms & Conditions
                      </Label>
                      <Textarea
                        id="terms_conditions"
                        value={formData.terms_conditions || ""}
                        onChange={(e) =>
                          handleInputChange("terms_conditions", e.target.value)
                        }
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="meal_plan">Meal Plan</Label>
                      <select
                        id="meal_plan"
                        value={formData.meal_plan || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            meal_plan: e.target.value,
                          }))
                        }
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="">Select meal plan</option>
                        {mealPlanOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="package_category">Package Category</Label>
                      <select
                        id="package_category"
                        value={formData.package_category || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            package_category: e.target.value,
                          }))
                        }
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="">Select category</option>
                        {packageCategoryOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="flight_included">Flight Included</Label>
                      <div className="flex items-center space-x-2">
                        <input
                          id="flight_included"
                          type="checkbox"
                          checked={!!formData.flight_included}
                          onChange={(e) =>
                            handleFlightIncludedChange(e.target.checked)
                          }
                        />
                        <span className="text-sm text-gray-500">
                          {formData.airline_name ||
                          formData.flight_type ||
                          formData.departure_from_airport ||
                          formData.return_from_airport
                            ? "✓ Auto-detected from flight details"
                            : "Check this if flight is included in package"}
                        </span>
                      </div>
                    </div>
                    {formData.flight_included && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                          <Label htmlFor="airline_name">Airline Name</Label>
                          <Input
                            id="airline_name"
                            value={formData.airline_name || ""}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                airline_name: e.target.value,
                              }))
                            }
                            placeholder="Enter airline name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="flight_type">Flight Type</Label>
                          <select
                            id="flight_type"
                            value={formData.flight_type || ""}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                flight_type: e.target.value,
                              }))
                            }
                            className="w-full border rounded px-3 py-2"
                          >
                            <option value="">Select type</option>
                            <option value="Direct">Direct</option>
                            <option value="Connecting">Connecting</option>
                          </select>
                        </div>
                        <div>
                          <Label htmlFor="departure_from_airport">
                            Departure Airport
                          </Label>
                          <Input
                            id="departure_from_airport"
                            value={formData.departure_from_airport || ""}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                departure_from_airport: e.target.value,
                              }))
                            }
                            placeholder="e.g., DEL, BOM, BLR"
                          />
                        </div>
                        <div>
                          <Label htmlFor="return_from_airport">
                            Return Airport
                          </Label>
                          <Input
                            id="return_from_airport"
                            value={formData.return_from_airport || ""}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                return_from_airport: e.target.value,
                              }))
                            }
                            placeholder="e.g., JED, RUH"
                          />
                        </div>
                      </div>
                    )}
                    {/* Add more fields as needed for arrays/JSON */}
                  </div>
                </section>

                {/* SEO & Social Sharing */}
                <section>
                  <h3 className="font-semibold mb-2">SEO & Social Sharing</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="meta_title">Meta Title</Label>
                      <Input
                        id="meta_title"
                        value={formData.meta_title || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            meta_title: e.target.value,
                          }))
                        }
                        maxLength={60}
                      />
                      <div className="text-xs text-gray-500">
                        Recommended: 50-60 characters. Use main keywords.
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="meta_description">Meta Description</Label>
                      <Textarea
                        id="meta_description"
                        value={formData.meta_description || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            meta_description: e.target.value,
                          }))
                        }
                        maxLength={160}
                        rows={2}
                      />
                      <div className="text-xs text-gray-500">
                        Recommended: 120-160 characters. Summarize the package
                        and include keywords.
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="target_keywords">Target Keywords</Label>
                      <Input
                        id="target_keywords"
                        value={formData.target_keywords?.join(",") || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            target_keywords: e.target.value
                              .split(",")
                              .map((k) => k.trim()),
                          }))
                        }
                      />
                      <div className="text-xs text-gray-500">
                        Comma separated. E.g. umrah, makkah, madinah, group
                        package
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug || ""}
                        onChange={(e) => {
                          const newSlug = e.target.value;
                          setFormData((prev) => ({ ...prev, slug: newSlug }));
                          checkSlugUnique(newSlug);
                        }}
                      />
                      <div className="text-xs text-gray-500">
                        Auto-generated from title/keywords. You can edit if
                        needed.
                      </div>
                    </div>
                    {slugError && (
                      <span className="text-red-500 text-xs">{slugError}</span>
                    )}
                    {slugChecking && (
                      <span className="text-gray-500 text-xs">
                        Checking slug...
                      </span>
                    )}
                    <div className="md:col-span-2">
                      <Label htmlFor="page_schema">Page Schema (JSON-LD)</Label>
                      <Textarea
                        id="page_schema"
                        value={formData.page_schema || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            page_schema: e.target.value,
                          }))
                        }
                        rows={3}
                      />
                      <div className="text-xs text-gray-500">
                        Paste valid JSON-LD for rich results (e.g. Product,
                        Breadcrumb, FAQ, etc).
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="og_title">OG Title</Label>
                      <Input
                        id="og_title"
                        value={formData.og_title || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            og_title: e.target.value,
                          }))
                        }
                        maxLength={60}
                      />
                      <div className="text-xs text-gray-500">
                        Open Graph title for social sharing. Usually same as
                        meta title.
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="og_description">OG Description</Label>
                      <Textarea
                        id="og_description"
                        value={formData.og_description || ""}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            og_description: e.target.value,
                          }))
                        }
                        maxLength={160}
                        rows={2}
                      />
                      <div className="text-xs text-gray-500">
                        Open Graph description for social sharing. Usually same
                        as meta description.
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="og_image">OG Image</Label>
                      <FileUpload
                        label="OG Image"
                        id="og_image"
                        onChange={handleOgImageUpload}
                        disabled={uploading}
                        previewUrls={
                          formData.og_image ? [formData.og_image] : []
                        }
                        uploading={uploading}
                        helper="Upload a 1200x630px image for best results."
                      />
                    </div>
                  </div>
                </section>

                {/* Itinerary */}
                <section>
                  <h3 className="font-semibold mb-2">Itinerary</h3>
                  <div className="flex gap-2 mb-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          itinerary: [
                            {
                              title:
                                "Day 1: Arrival in Makkah & Umrah – First Embrace of the Divine House",
                              description:
                                "Arrive in the blessed city of Makkah. After check-in and a moment to settle, enter Ihram (if not already done), and perform your Umrah — the Tawaf, Sa'i, and Halq/Qasr. Your heart will never forget the first sight of the Kaaba. The journey of purification begins.",
                            },
                            {
                              title:
                                "Day 2–3: Worship & Stillness – Time with Your Lord",
                              description:
                                "Spend time in Masjid al-Haram, absorbing its spiritual light. Pray, reflect, make dua. These are days of silence, sincerity, and surrender. Let the world fade. Let Allah remain.",
                            },
                            {
                              title:
                                "Day 4: Makkah Ziyarah + Masjid Jor'ana – Following the Path of the Prophets",
                              description:
                                "A guided visit to the most revered sites of Makkah: Mina, Arafat, Muzdalifah, Jabal al-Noor, Jabal al-Thawr, and Jannat al-Mu'alla. End at Masjid Jor'ana — where the Prophet ﷺ entered Ihram. You may choose to do so as well, and relive a Nafl Umrah as he did.",
                            },
                            {
                              title:
                                "Day 5: Visit to Masjid Aisha – Honoring Her Devotion",
                              description:
                                "Privately visit Masjid Aisha (Masjid Taneem), where Ummul Mu'minin Hazrat Aisha (RA) was granted special permission to perform her Umrah. A moment of reflection on personal sacrifice and spiritual yearning. This is not a group activity — just you and your intention.",
                            },
                            {
                              title:
                                "Day 6: Optional Taif Excursion – Where the Prophet ﷺ Wept, Angels Watched",
                              description:
                                "An optional full-day trip to Taif. Walk through the valley where the Prophet ﷺ was wounded and humiliated, yet responded only with dua. A land of pain turned into prayer — a lesson for every believer.",
                            },
                            {
                              title:
                                "Day 7–9: Last Days in Makkah – Overflowing Hearts, Open Palms",
                              description:
                                "Continue your days of devotion. Perform another Nafl Umrah if desired. Pray near the Kaaba, seek forgiveness, and make lifelong promises to Allah. These moments will live in your heart forever.",
                            },
                            {
                              title:
                                "Day 10: Journey to Madinah via Badr – From Struggle to Submission",
                              description:
                                "Depart for Madinah by road. Stop at the battlefield of Badr — where 313 believers stood in complete trust of Allah and were granted divine victory. Reflect on what it means to trust and surrender.",
                            },
                            {
                              title:
                                "Day 11: Arrival in Madinah – Salaam Ya Rasool ﷺ",
                              description:
                                "Check in and visit Masjid an-Nabawi for your first salaam. The Rawdah awaits — a garden from Paradise. Send your salawat, hold your tears. You are in the presence of the Beloved ﷺ.",
                            },
                            {
                              title:
                                "Day 12: Madinah Ziyarah – A City Shaped by Revelation",
                              description:
                                "Visit Masjid Quba, Masjid Qiblatain, Mount Uhud, and Jannat al-Baqi'. Each site is a chapter in the story of Islam, each step a reminder of love, loyalty, and sacrifice.",
                            },
                            {
                              title:
                                "Day 13–14: Moments in Madinah – A City of Peace",
                              description:
                                "Spend time in quiet worship and reflection. Each salah in the Prophet's Mosque is worth 1,000 elsewhere. Think, write, make dua — and transform every intention into a plan for change.",
                            },
                            {
                              title: "Day 15: Departure – A Heart Washed Clean",
                              description:
                                "Return home with a soul renewed, sins forgiven, and faith restored. This is not the end. It's the beginning of living what you prayed for.",
                            },
                          ],
                        }));
                      }}
                    >
                      15 Days
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          itinerary: [
                            {
                              title:
                                "Day 1: Arrival in Makkah & Umrah – The First Gaze",
                              description:
                                "Arrive in Makkah, check into your hotel, and prepare for Umrah. Perform Tawaf, Sa'i, and Halq/Qasr with full heart. A lifetime of sins forgiven in a single evening.",
                            },
                            {
                              title: "Day 2: Makkah Reflections & Ziyarah",
                              description:
                                "Visit Mina, Arafat, Muzdalifah, Jabal al-Noor, and Jannat al-Mu'alla. Spend your last night in sincere worship near the Kaaba — the House of your Lord.",
                            },
                            {
                              title:
                                "Day 3: Travel to Madinah & Salaam to the Prophet ﷺ",
                              description:
                                "Early morning transfer to Madinah. Visit Masjid an-Nabawi and offer your first salaam. Return home with tears of love and a soul uplifted.",
                            },
                          ],
                        }));
                      }}
                    >
                      3 Days
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const newItinerary = Array.isArray(formData.itinerary)
                          ? [...formData.itinerary]
                          : [];
                        newItinerary.push({ title: "", description: "" });
                        setFormData((prev) => ({
                          ...prev,
                          itinerary: newItinerary,
                        }));
                      }}
                    >
                      Add Itinerary
                    </Button>
                  </div>
                  {formData.itinerary &&
                  Array.isArray(formData.itinerary) &&
                  formData.itinerary.length > 0 ? (
                    formData.itinerary.map((item, idx) => (
                      <div
                        key={idx}
                        className="mb-4 border rounded p-3 relative"
                      >
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <Label htmlFor={`itinerary-title-${idx}`}>
                              Title
                            </Label>
                            <Input
                              id={`itinerary-title-${idx}`}
                              value={item.title || ""}
                              onChange={(e) => {
                                const newItinerary = [...formData.itinerary];
                                newItinerary[idx] = {
                                  ...newItinerary[idx],
                                  title: e.target.value,
                                };
                                setFormData((prev) => ({
                                  ...prev,
                                  itinerary: newItinerary,
                                }));
                              }}
                              placeholder="Itinerary title"
                            />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor={`itinerary-desc-${idx}`}>
                              Description
                            </Label>
                            <Textarea
                              id={`itinerary-desc-${idx}`}
                              value={item.description || ""}
                              onChange={(e) => {
                                const newItinerary = [...formData.itinerary];
                                newItinerary[idx] = {
                                  ...newItinerary[idx],
                                  description: e.target.value,
                                };
                                setFormData((prev) => ({
                                  ...prev,
                                  itinerary: newItinerary,
                                }));
                              }}
                              placeholder="Itinerary description"
                              rows={2}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            className="self-end h-10 ml-2"
                            onClick={() => {
                              const newItinerary = formData.itinerary.filter(
                                (_, i) => i !== idx,
                              );
                              setFormData((prev) => ({
                                ...prev,
                                itinerary: newItinerary,
                              }));
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 mb-2">
                      No itinerary added yet.
                    </div>
                  )}
                </section>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading
                      ? "Saving..."
                      : editingPackage
                        ? "Update Package"
                        : "Create Package"}
                  </Button>
                  {editingPackage && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Existing Packages</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div>Loading packages...</div>
              ) : packages.length === 0 ? (
                <div>No packages found</div>
              ) : (
                <div className="space-y-4">
                  {packages.map((pkg) => (
                    <div key={pkg.id} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{pkg.name}</h3>
                          <p className="text-sm text-gray-600">
                            {pkg.description}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="outline">{pkg.duration}</Badge>
                            <Badge variant="outline">
                              {getCurrencySymbol(pkg.currency)}
                              {pkg.price}
                            </Badge>
                            <Badge
                              variant={
                                pkg.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {pkg.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(pkg)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => pkg.id && handleDelete(pkg.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PackageManager;
