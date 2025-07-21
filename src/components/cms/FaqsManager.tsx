import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import ReactMarkdown from "react-markdown";

interface Faq {
  id: number;
  question: string;
  answer: string;
  page: "home" | "faqs" | "visa";
  seo_title?: string | null;
  seo_description?: string | null;
  keywords?: string[] | null;
}

type TabType = "home" | "faqs" | "visa";

const tabLabels: Record<TabType, string> = {
  home: "Home Page",
  faqs: "FAQs Page",
  visa: "Visa FAQs",
};

const SEO_SETTINGS_TAB = "seo-settings";

const FaqsManager: React.FC = () => {
  const [tab, setTab] = useState<TabType | typeof SEO_SETTINGS_TAB>("home");
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<{
    question: string;
    answer: string;
    seo_title: string;
    seo_description: string;
    keywords: string;
  }>({
    question: "",
    answer: "",
    seo_title: "",
    seo_description: "",
    keywords: "",
  });
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [seoSettings, setSeoSettings] = useState({
    meta_title:
      "Frequently Asked Questions | Umrah Visa, Packages, Services - Marhaba Haji",
    meta_description:
      "Get answers to the most common questions about Umrah visas, packages, and services. Expert guidance, 24/7 support, and up-to-date information.",
    breadcrumb_home: "Home",
    breadcrumb_faq: "FAQs",
    canonical_url: "https://yourdomain.com/faq",
  });
  const [seoLoading, setSeoLoading] = useState(false);
  const [seoSaving, setSeoSaving] = useState(false);

  const fetchFaqs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("faqs")
      .select(
        "id, question, answer, page, seo_title, seo_description, keywords",
      )
      .eq("page", tab);
    if (!error && data) setFaqs(data);
    setLoading(false);
  };

  // Fetch SEO settings from Supabase
  const fetchSeoSettings = async () => {
    setSeoLoading(true);
    const { data, error } = await supabase
      .from("faq_seo_settings")
      .select(
        "meta_title, meta_description, breadcrumb_home, breadcrumb_faq, canonical_url",
      )
      .single();
    if (!error && data)
      setSeoSettings({
        meta_title:
          data.meta_title ||
          "Frequently Asked Questions | Umrah Visa, Packages, Services - Marhaba Haji",
        meta_description:
          data.meta_description ||
          "Get answers to the most common questions about Umrah visas, packages, and services. Expert guidance, 24/7 support, and up-to-date information.",
        breadcrumb_home: data.breadcrumb_home || "Home",
        breadcrumb_faq: data.breadcrumb_faq || "FAQs",
        canonical_url: data.canonical_url || "https://yourdomain.com/faq",
      });
    setSeoLoading(false);
  };

  useEffect(() => {
    fetchFaqs();
    if (tab === SEO_SETTINGS_TAB) fetchSeoSettings();
    // eslint-disable-next-line
  }, [tab]);

  const handleAddOrEditFaq = async () => {
    setSaving(true);
    const payload = {
      question: form.question,
      answer: form.answer,
      page: tab,
      seo_title: form.seo_title || null,
      seo_description: form.seo_description || null,
      keywords: form.keywords
        ? form.keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean)
        : null,
    };
    if (editId) {
      // Edit
      const { error } = await supabase
        .from("faqs")
        .update(payload)
        .eq("id", editId);
      setSaving(false);
      if (!error) {
        setShowDialog(false);
        setForm({
          question: "",
          answer: "",
          seo_title: "",
          seo_description: "",
          keywords: "",
        });
        setEditId(null);
        fetchFaqs();
      } else {
        alert("Error updating FAQ");
      }
    } else {
      // Add
      const { error } = await supabase.from("faqs").insert(payload);
      setSaving(false);
      if (!error) {
        setShowDialog(false);
        setForm({
          question: "",
          answer: "",
          seo_title: "",
          seo_description: "",
          keywords: "",
        });
        fetchFaqs();
      } else {
        alert("Error adding FAQ");
      }
    }
  };

  const handleEdit = (faq: Faq) => {
    setEditId(faq.id);
    setForm({
      question: faq.question,
      answer: faq.answer,
      seo_title: faq.seo_title || "",
      seo_description: faq.seo_description || "",
      keywords: faq.keywords ? faq.keywords.join(", ") : "",
    });
    setShowDialog(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    const { error } = await supabase.from("faqs").delete().eq("id", deleteId);
    setDeleting(false);
    setDeleteId(null);
    if (!error) {
      fetchFaqs();
    } else {
      alert("Error deleting FAQ");
    }
  };

  const handleSaveSeoSettings = async () => {
    setSeoSaving(true);
    // Upsert (insert or update)
    const { error } = await supabase.from("faq_seo_settings").upsert(
      {
        id: 1,
        ...seoSettings,
      },
      { onConflict: "id" },
    );
    setSeoSaving(false);
    if (!error) {
      alert("SEO settings saved!");
    } else {
      alert("Error saving SEO settings");
    }
  };

  return (
    <Card className="shadow-none border-none">
      <CardContent>
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as TabType | typeof SEO_SETTINGS_TAB)}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="home">Home Page</TabsTrigger>
            <TabsTrigger value="faqs">FAQs Page</TabsTrigger>
            <TabsTrigger value="visa">Visa FAQs</TabsTrigger>
            <TabsTrigger value={SEO_SETTINGS_TAB}>SEO Settings</TabsTrigger>
          </TabsList>
          {(["home", "faqs", "visa"] as TabType[]).map((t) => (
            <TabsContent value={t} key={t}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{tabLabels[t]} FAQs</h2>
                <Button
                  onClick={() => {
                    setShowDialog(true);
                    setEditId(null);
                    setForm({
                      question: "",
                      answer: "",
                      seo_title: "",
                      seo_description: "",
                      keywords: "",
                    });
                  }}
                >
                  Add FAQ
                </Button>
              </div>
              <FaqsTable
                faqs={faqs}
                loading={loading}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteId(id)}
              />
            </TabsContent>
          ))}
          <TabsContent value={SEO_SETTINGS_TAB}>
            <div className="max-w-xl mx-auto space-y-6">
              <h2 className="text-lg font-semibold mb-4">
                FAQ Page SEO Settings
              </h2>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Meta Title</label>
                <Input
                  value={seoSettings.meta_title}
                  onChange={(e) =>
                    setSeoSettings((s) => ({
                      ...s,
                      meta_title: e.target.value,
                    }))
                  }
                  placeholder="Meta Title"
                  disabled={seoLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Meta Description
                </label>
                <Textarea
                  value={seoSettings.meta_description}
                  onChange={(e) =>
                    setSeoSettings((s) => ({
                      ...s,
                      meta_description: e.target.value,
                    }))
                  }
                  placeholder="Meta Description"
                  disabled={seoLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Breadcrumb Home Label
                </label>
                <Input
                  value={seoSettings.breadcrumb_home}
                  onChange={(e) =>
                    setSeoSettings((s) => ({
                      ...s,
                      breadcrumb_home: e.target.value,
                    }))
                  }
                  placeholder="Breadcrumb Home Label"
                  disabled={seoLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Breadcrumb FAQ Label
                </label>
                <Input
                  value={seoSettings.breadcrumb_faq}
                  onChange={(e) =>
                    setSeoSettings((s) => ({
                      ...s,
                      breadcrumb_faq: e.target.value,
                    }))
                  }
                  placeholder="Breadcrumb FAQ Label"
                  disabled={seoLoading}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Canonical URL
                </label>
                <Input
                  value={seoSettings.canonical_url}
                  onChange={(e) =>
                    setSeoSettings((s) => ({
                      ...s,
                      canonical_url: e.target.value,
                    }))
                  }
                  placeholder="Canonical URL"
                  disabled={seoLoading}
                />
              </div>
              <Button
                onClick={handleSaveSeoSettings}
                disabled={seoSaving || seoLoading}
                className="mt-4"
              >
                {seoSaving ? "Saving..." : "Save SEO Settings"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        <Dialog
          open={showDialog}
          onOpenChange={(v) => {
            setShowDialog(v);
            if (!v) {
              setEditId(null);
              setForm({
                question: "",
                answer: "",
                seo_title: "",
                seo_description: "",
                keywords: "",
              });
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Question"
                value={form.question}
                onChange={(e) =>
                  setForm((f) => ({ ...f, question: e.target.value }))
                }
              />
              <Textarea
                placeholder="Answer (supports markdown, e.g. [Umrah Packages](/umrah-packages))"
                value={form.answer}
                onChange={(e) =>
                  setForm((f) => ({ ...f, answer: e.target.value }))
                }
              />
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Preview:
                </label>
                <div className="prose prose-sm max-w-none border rounded p-2 bg-gray-50">
                  <ReactMarkdown>{form.answer}</ReactMarkdown>
                </div>
              </div>
              <Input
                placeholder="SEO Title (optional)"
                value={form.seo_title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, seo_title: e.target.value }))
                }
              />
              <Textarea
                placeholder="SEO Description (optional)"
                value={form.seo_description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, seo_description: e.target.value }))
                }
              />
              <Input
                placeholder="Keywords (comma separated, optional)"
                value={form.keywords}
                onChange={(e) =>
                  setForm((f) => ({ ...f, keywords: e.target.value }))
                }
              />
            </div>
            <DialogFooter>
              <Button
                onClick={handleAddOrEditFaq}
                disabled={saving || !form.question || !form.answer}
              >
                {saving
                  ? editId
                    ? "Saving..."
                    : "Adding..."
                  : editId
                    ? "Save Changes"
                    : "Add FAQ"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Delete Confirm Dialog */}
        <Dialog
          open={!!deleteId}
          onOpenChange={(v) => {
            if (!v) setDeleteId(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete FAQ</DialogTitle>
            </DialogHeader>
            <div>Are you sure you want to delete this FAQ?</div>
            <DialogFooter>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

const FaqsTable: React.FC<{
  faqs: Faq[];
  loading: boolean;
  onEdit: (faq: Faq) => void;
  onDelete: (id: number) => void;
}> = ({ faqs, loading, onEdit, onDelete }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white border border-gray-200 rounded shadow">
      <thead>
        <tr>
          <th className="px-4 py-2 border-b">ID</th>
          <th className="px-4 py-2 border-b">Question</th>
          <th className="px-4 py-2 border-b">Answer</th>
          <th className="px-4 py-2 border-b">SEO Title</th>
          <th className="px-4 py-2 border-b">SEO Description</th>
          <th className="px-4 py-2 border-b">Keywords</th>
          <th className="px-4 py-2 border-b">Actions</th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={7} className="text-center py-4">
              Loading...
            </td>
          </tr>
        ) : faqs.length === 0 ? (
          <tr>
            <td colSpan={7} className="text-center py-4">
              No FAQs found
            </td>
          </tr>
        ) : (
          faqs.map((faq) => (
            <tr key={faq.id}>
              <td className="px-4 py-2 border-b text-xs text-gray-500">
                {faq.id}
              </td>
              <td className="px-4 py-2 border-b font-medium">{faq.question}</td>
              <td className="px-4 py-2 border-b">{faq.answer}</td>
              <td className="px-4 py-2 border-b">
                {faq.seo_title || <span className="text-gray-400">-</span>}
              </td>
              <td className="px-4 py-2 border-b">
                {faq.seo_description || (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="px-4 py-2 border-b">
                {faq.keywords && faq.keywords.length > 0 ? (
                  faq.keywords.join(", ")
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="px-4 py-2 border-b">
                <Button
                  size="sm"
                  variant="outline"
                  className="mr-2"
                  onClick={() => onEdit(faq)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onDelete(faq.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default FaqsManager;
