import React, { useEffect, useState, useRef } from "react";
import { supabase, SUPABASE_URL } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Activity {
  id: string;
  name: string;
  city: string;
  description: string;
  duration?: string;
  price?: number;
  featured_image?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  gallery?: string[];
  inclusions?: string;
  exclusions?: string;
  sites?: string;
  features?: string;
  faqs?: Faq[];
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  page_schema?: object;
  vehicle_prices?: Record<string, number>;
  slug?: string;
  terms_and_conditions?: string;
  disclaimer?: string;
}

interface Faq {
  q: string;
  a: string;
}

interface ActivityFormData {
  name: string;
  city: string;
  description: string;
  duration?: string;
  price?: number;
  featured_image?: string;
  is_featured: boolean;
  gallery: string[];
  inclusions?: string;
  exclusions?: string;
  sites?: string;
  features?: string;
  faqs: Faq[];
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  page_schema?: object;
  vehicle_prices?: Record<string, number>;
  slug?: string;
  terms_and_conditions?: string;
  disclaimer?: string;
}

const emptyActivity: ActivityFormData = {
  name: "",
  city: "",
  description: "",
  duration: "",
  price: 0,
  featured_image: "",
  is_featured: false,
  gallery: [],
  inclusions: "",
  exclusions: "",
  sites: "",
  features: "",
  faqs: [],
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  og_title: "",
  og_description: "",
  og_image: "",
  canonical_url: "",
  page_schema: {},
  vehicle_prices: {},
  slug: "",
  terms_and_conditions: "",
  disclaimer: "",
};

// Add type for raw Supabase row
interface SupabaseActivityRow {
  id: string;
  name: string;
  city: string;
  description: string;
  duration?: string;
  price?: number;
  featured_image?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  gallery?: string | string[];
  inclusions?: string;
  exclusions?: string;
  sites?: string;
  features?: string;
  faqs?: string | Faq[];
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  canonical_url?: string;
  page_schema?: string | object;
  vehicle_prices?: string | Record<string, number>;
  slug?: string;
  terms_and_conditions?: string;
  disclaimer?: string;
}

const ActivityManager = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<ActivityFormData>(emptyActivity);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);

  const fetchActivities = async (): Promise<void> => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("Error fetching activities:", error);
    } else {
      setActivities(
        ((data as SupabaseActivityRow[]) || []).map(
          (a: SupabaseActivityRow) => ({
            ...a,
            slug: a.slug || "",
            vehicle_prices:
              typeof a.vehicle_prices === "string"
                ? JSON.parse(a.vehicle_prices)
                : a.vehicle_prices || {},
            gallery:
              typeof a.gallery === "string"
                ? JSON.parse(a.gallery)
                : a.gallery || [],
            faqs:
              typeof a.faqs === "string" ? JSON.parse(a.faqs) : a.faqs || [],
            page_schema:
              typeof a.page_schema === "string"
                ? JSON.parse(a.page_schema)
                : a.page_schema || {},
          }),
        ),
      );
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const openCreate = (): void => {
    setFormData(emptyActivity);
    setEditingId(null);
    setFormError(null);
    setModalOpen(true);
  };

  const openEdit = (activity: Activity): void => {
    setFormData({
      name: activity.name,
      city: activity.city,
      description: activity.description,
      duration: activity.duration || "",
      price: activity.price || 0,
      featured_image: activity.featured_image || "",
      is_featured: activity.is_featured,
      gallery: Array.isArray(activity.gallery)
        ? activity.gallery
        : activity.gallery
          ? JSON.parse(activity.gallery)
          : [],
      inclusions: activity.inclusions || "",
      exclusions: activity.exclusions || "",
      sites: activity.sites || "",
      features: activity.features || "",
      faqs: Array.isArray(activity.faqs)
        ? activity.faqs
        : activity.faqs
          ? JSON.parse(activity.faqs)
          : [],
      meta_title: activity.meta_title || "",
      meta_description: activity.meta_description || "",
      meta_keywords: activity.meta_keywords || "",
      og_title: activity.og_title || "",
      og_description: activity.og_description || "",
      og_image: activity.og_image || "",
      canonical_url: activity.canonical_url || "",
      page_schema:
        typeof activity.page_schema === "object" &&
        activity.page_schema !== null
          ? activity.page_schema
          : activity.page_schema
            ? JSON.parse(activity.page_schema)
            : {},
      vehicle_prices:
        typeof activity.vehicle_prices === "object" &&
        activity.vehicle_prices !== null
          ? activity.vehicle_prices
          : activity.vehicle_prices
            ? JSON.parse(activity.vehicle_prices)
            : {},
      slug: activity.slug || "",
      terms_and_conditions: activity.terms_and_conditions || "",
      disclaimer: activity.disclaimer || "",
    });
    setEditingId(activity.id);
    setFormError(null);
    setModalOpen(true);
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm("Delete this activity?")) return;
    await supabase.from("activities").delete().eq("id", id);
    fetchActivities();
  };

  const handleChange = <K extends keyof ActivityFormData>(
    field: K,
    value: ActivityFormData[K],
  ): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleJsonChange = (
    field: keyof Pick<
      ActivityFormData,
      "gallery" | "faqs" | "vehicle_prices" | "page_schema"
    >,
    value: string,
  ): void => {
    try {
      let parsed;
      if (field === "gallery")
        parsed = value ? (JSON.parse(value) as string[]) : [];
      else if (field === "faqs")
        parsed = value ? (JSON.parse(value) as Faq[]) : [];
      else if (field === "vehicle_prices")
        parsed = value ? (JSON.parse(value) as Record<string, number>) : {};
      else parsed = value ? (JSON.parse(value) as object) : {};
      setFormData((prev) => ({ ...prev, [field]: parsed }));
      setFormError(null);
    } catch (e) {
      setFormError(`Invalid JSON in ${field}`);
    }
  };

  const handleFeaturedImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const file = files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-featured.${fileExt}`;
      const { error } = await supabase.storage
        .from("activities-images")
        .upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data: publicUrlData } = supabase.storage
        .from("activities-images")
        .getPublicUrl(fileName);
      if (publicUrlData?.publicUrl) {
        setFormData((prev) => ({
          ...prev,
          featured_image: publicUrlData.publicUrl,
        }));
      }
    } catch (err) {
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setGalleryUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const fileExt = file.name.split(".")?.pop();
        const fileName = `${Date.now()}-gallery-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const { error } = await supabase.storage
          .from("activities-images")
          .upload(fileName, file, { upsert: true });
        if (error) throw error;
        const { data: publicUrlData } = supabase.storage
          .from("activities-images")
          .getPublicUrl(fileName);
        if (publicUrlData?.publicUrl) urls.push(publicUrlData.publicUrl);
      }
      setFormData((prev) => ({
        ...prev,
        gallery: [
          ...(Array.isArray(prev.gallery) ? prev.gallery : []),
          ...urls,
        ],
      }));
    } catch (err) {
      alert("Gallery image upload failed.");
    } finally {
      setGalleryUploading(false);
    }
  };

  const handleRemoveGalleryImage = (url: string): void => {
    setFormData((prev) => ({
      ...prev,
      gallery: (Array.isArray(prev.gallery) ? prev.gallery : []).filter(
        (img) => img !== url,
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);
    const payload = {
      ...formData,
      gallery: JSON.stringify(formData.gallery),
      faqs: JSON.stringify(formData.faqs),
      vehicle_prices: JSON.stringify(formData.vehicle_prices),
      page_schema: JSON.stringify(formData.page_schema),
    };
    let result;
    if (editingId) {
      result = await supabase
        .from("activities")
        .update(payload)
        .eq("id", editingId);
    } else {
      result = await supabase.from("activities").insert([payload]);
    }
    if (result.error) {
      setFormError(result.error.message);
    } else {
      setModalOpen(false);
      fetchActivities();
    }
    setSaving(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Activities</h2>
        <Button onClick={openCreate}>Create Activity</Button>
      </div>
      {isLoading && <p>Loading activities...</p>}
      {!isLoading && activities.length === 0 && <p>No activities found.</p>}
      {!isLoading && activities.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-x-auto mt-4">
          <table className="min-w-full text-sm align-middle">
            <thead>
              <tr className="bg-gray-50 text-gray-700 uppercase text-xs tracking-wider">
                <th className="py-3 px-4 text-left rounded-tl-xl">Image</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">City</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-center">Featured</th>
                <th className="py-3 px-4 text-center rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr
                  key={activity.id}
                  className="hover:bg-gray-50 border-b last:border-b-0"
                >
                  <td className="py-2 px-4 align-middle">
                    {activity.featured_image ? (
                      <img
                        src={activity.featured_image}
                        alt={activity.name}
                        className="w-14 h-14 object-cover rounded-md border border-gray-200 shadow-sm"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs border border-gray-200">
                        N/A
                      </div>
                    )}
                  </td>
                  <td
                    className="py-2 px-4 align-middle max-w-[180px] truncate"
                    title={activity.name}
                  >
                    {activity.name}
                  </td>
                  <td
                    className="py-2 px-4 align-middle max-w-[120px] truncate"
                    title={activity.city}
                  >
                    {activity.city}
                  </td>
                  <td className="py-2 px-4 align-middle whitespace-nowrap font-semibold text-emerald-700">
                    {activity.price ? `₹${activity.price}` : "-"}
                  </td>
                  <td className="py-2 px-4 align-middle text-center">
                    {activity.is_featured ? (
                      <span className="inline-block px-2 py-1 text-xs font-bold bg-yellow-100 text-yellow-800 rounded-full">
                        Featured
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-full">
                        No
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4 align-middle text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEdit(activity)}
                        className="border-blue-500 text-blue-700 hover:bg-blue-50"
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(activity.id)}
                        className="border-red-500"
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Activity" : "Create Activity"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit}
            className="space-y-3 max-h-[70vh] overflow-y-auto"
          >
            <Input
              placeholder="Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
            <Input
              placeholder="City"
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              required
            />
            <AutoExpandingTextarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              required
            />
            <Input
              placeholder="Duration"
              value={formData.duration}
              onChange={(e) => handleChange("duration", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Price"
              value={formData.price}
              onChange={(e) => handleChange("price", Number(e.target.value))}
            />
            <div>
              <label className="block text-sm font-medium mb-1">
                Featured Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFeaturedImageUpload}
                disabled={uploading}
              />
              {uploading && (
                <span className="text-xs text-blue-500 ml-2">Uploading...</span>
              )}
              {formData.featured_image && (
                <div className="mt-2">
                  <img
                    src={formData.featured_image}
                    alt="Featured"
                    className="h-20 rounded shadow border"
                  />
                </div>
              )}
            </div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.is_featured}
                onChange={(e) => handleChange("is_featured", e.target.checked)}
              />
              <span>Is Featured</span>
            </label>
            <Textarea
              placeholder="Inclusions (one per line)"
              value={formData.inclusions}
              onChange={(e) => handleChange("inclusions", e.target.value)}
            />
            <Textarea
              placeholder="Exclusions (one per line)"
              value={formData.exclusions}
              onChange={(e) => handleChange("exclusions", e.target.value)}
            />
            <Textarea
              placeholder="Sites (one per line)"
              value={formData.sites}
              onChange={(e) => handleChange("sites", e.target.value)}
            />
            <Textarea
              placeholder="Features (comma or line separated)"
              value={formData.features}
              onChange={(e) => handleChange("features", e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium mb-1">
                Gallery Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                disabled={galleryUploading}
              />
              {galleryUploading && (
                <span className="text-xs text-blue-500 ml-2">Uploading...</span>
              )}
              {Array.isArray(formData.gallery) &&
                formData.gallery.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {formData.gallery.map((url: string, idx: number) => (
                      <div key={idx} className="relative group">
                        <img
                          src={url}
                          alt={`Gallery ${idx + 1}`}
                          className="h-16 w-16 object-cover rounded border shadow"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryImage(url)}
                          className="absolute top-0 right-0 bg-white bg-opacity-80 rounded-full p-1 text-xs text-red-600 shadow group-hover:opacity-100 opacity-0 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
            </div>
            <div className="border rounded-lg p-4 bg-gray-50 mt-4">
              <div className="font-semibold text-gray-700 mb-2">
                SEO & Metadata
              </div>
              <Textarea
                placeholder="Meta Title"
                value={formData.meta_title}
                onChange={(e) => handleChange("meta_title", e.target.value)}
              />
              <Textarea
                placeholder="Meta Description"
                value={formData.meta_description}
                onChange={(e) =>
                  handleChange("meta_description", e.target.value)
                }
              />
              <Textarea
                placeholder="Meta Keywords"
                value={formData.meta_keywords}
                onChange={(e) => handleChange("meta_keywords", e.target.value)}
              />
              <Textarea
                placeholder="OG Title"
                value={formData.og_title}
                onChange={(e) => handleChange("og_title", e.target.value)}
              />
              <Textarea
                placeholder="OG Description"
                value={formData.og_description}
                onChange={(e) => handleChange("og_description", e.target.value)}
              />
              <Input
                placeholder="OG Image URL"
                value={formData.og_image}
                onChange={(e) => handleChange("og_image", e.target.value)}
              />
              <Input
                placeholder="Canonical URL"
                value={formData.canonical_url}
                onChange={(e) => handleChange("canonical_url", e.target.value)}
              />
              <Input
                placeholder="Slug (unique)"
                value={formData.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
              />
              <label>Page Schema (JSON object)</label>
              <Textarea
                value={JSON.stringify(formData.page_schema, null, 2)}
                onChange={(e) =>
                  handleJsonChange("page_schema", e.target.value)
                }
              />
            </div>
            <Textarea
              placeholder="Terms and Conditions"
              value={formData.terms_and_conditions}
              onChange={(e) =>
                handleChange("terms_and_conditions", e.target.value)
              }
            />
            <Textarea
              placeholder="Disclaimer"
              value={formData.disclaimer}
              onChange={(e) => handleChange("disclaimer", e.target.value)}
            />
            <label>FAQs (JSON array)</label>
            <Textarea
              value={JSON.stringify(formData.faqs, null, 2)}
              onChange={(e) => handleJsonChange("faqs", e.target.value)}
            />
            <label>Vehicle Prices (JSON object)</label>
            <Textarea
              value={JSON.stringify(formData.vehicle_prices, null, 2)}
              onChange={(e) =>
                handleJsonChange("vehicle_prices", e.target.value)
              }
            />
            {formError && (
              <div className="text-red-600 text-sm">{formError}</div>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setModalOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving || !!formError}>
                {saving ? "Saving..." : editingId ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Auto-expanding textarea component
function AutoExpandingTextarea({ value, onChange, ...props }) {
  const ref = useRef(null);
  React.useLayoutEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = ref.current.scrollHeight + "px";
    }
  }, [value]);
  return (
    <Textarea
      ref={ref}
      rows={3}
      style={{ resize: "none", overflow: "hidden" }}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
}

export default ActivityManager;
