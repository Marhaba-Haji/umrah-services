import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";

interface Faq {
  id: number;
  question: string;
  answer: string;
  seo_title?: string | null;
  seo_description?: string | null;
  keywords?: string[] | null;
  updated_at?: string | null;
  helpful_count?: number;
}

function injectFAQJsonLD(faqs: Faq[]) {
  if (!faqs.length) return;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.seo_title || faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.seo_description || faq.answer,
        ...(faq.updated_at ? { dateModified: faq.updated_at } : {}),
      },
    })),
  };
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.id = "faq-jsonld";
  script.text = JSON.stringify(jsonLd);
  // Remove any previous script
  const prev = document.getElementById("faq-jsonld");
  if (prev) prev.remove();
  document.head.appendChild(script);
}

interface FAQSectionProps {
  page?: string;
}

const FAQSection: React.FC<FAQSectionProps> = ({ page = "faqs" }) => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [voted, setVoted] = useState<{ [faqId: number]: boolean }>({});

  useEffect(() => {
    const votedMap: { [faqId: number]: boolean } = {};
    try {
      const stored = localStorage.getItem("faq_helpful_voted");
      if (stored) Object.assign(votedMap, JSON.parse(stored));
    } catch (e) {
      /* ignore */
    }
    setVoted(votedMap);
  }, []);

  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("faqs")
        .select(
          "id, question, answer, seo_title, seo_description, keywords, updated_at, helpful_count",
        )
        .eq("page", page);
      if (!error && data) setFaqs(data);
      setLoading(false);
    };
    fetchFaqs();
  }, [page]);

  useEffect(() => {
    if (!loading && faqs.length > 0) {
      injectFAQJsonLD(faqs);
    }
  }, [loading, faqs]);

  function formatDate(dateStr?: string | null) {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  async function handleHelpful(faqId: number) {
    if (voted[faqId]) return;
    // Optimistically update UI
    setFaqs((faqs) =>
      faqs.map((f) =>
        f.id === faqId
          ? { ...f, helpful_count: (f.helpful_count || 0) + 1 }
          : f,
      ),
    );
    setVoted((v) => {
      const updated = { ...v, [faqId]: true };
      localStorage.setItem("faq_helpful_voted", JSON.stringify(updated));
      return updated;
    });
    // Update in Supabase
    await supabase.rpc("increment_faq_helpful", { faq_id: faqId });
  }

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get answers to the most common questions about our services. Can't
            find what you're looking for? Contact our experts.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Loading FAQs...
              </div>
            ) : faqs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No FAQs found.
              </div>
            ) : (
              faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.id}
                  value={`item-${faq.id}`}
                  className="border border-gray-200 rounded-lg px-6 py-2 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <AccordionTrigger
                    className="text-left font-semibold text-gray-900 hover:text-emerald-600"
                    id={`faq-question-${faq.id}`}
                    aria-controls={`faq-answer-${faq.id}`}
                  >
                    <h3 className="text-lg font-semibold m-0">
                      {faq.seo_title || faq.question}
                    </h3>
                  </AccordionTrigger>
                  <AccordionContent
                    className="text-gray-700 leading-relaxed pt-2"
                    id={`faq-answer-${faq.id}`}
                    role="region"
                    aria-labelledby={`faq-question-${faq.id}`}
                  >
                    <ReactMarkdown
                      components={{
                        a: ({ node, ...props }) => (
                          <a
                            {...props}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {props.children}
                          </a>
                        ),
                      }}
                    >
                      {faq.seo_description || faq.answer}
                    </ReactMarkdown>
                    {faq.updated_at && (
                      <div className="text-xs text-gray-400 mt-2">
                        Last updated: {formatDate(faq.updated_at)}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        size="sm"
                        variant={voted[faq.id] ? "secondary" : "outline"}
                        disabled={voted[faq.id]}
                        onClick={() => handleHelpful(faq.id)}
                        aria-label={
                          voted[faq.id]
                            ? "You have already marked this FAQ as helpful"
                            : "Mark this FAQ as helpful"
                        }
                      >
                        <span aria-hidden="true">👍</span>
                        <span className="sr-only">Mark as helpful</span>
                        Was this helpful?
                      </Button>
                      <span className="text-xs text-gray-500">
                        {faq.helpful_count || 0} found this helpful
                      </span>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))
            )}
          </Accordion>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <div className="bg-emerald-50 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our experts are available 24/7 to help. Get personalized
              assistance in multiple languages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                onClick={() => {
                  const message = `Hello, I need assistance with my application. Please connect me with an expert.`;
                  const whatsappUrl = `https://wa.me/919008447887?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, "_blank");
                }}
              >
                💬 Chat with Expert
              </button>
              <button
                className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-6 py-3 rounded-lg font-medium transition-colors"
                onClick={() => {
                  window.open("tel:+917892009800");
                }}
              >
                📞 Call Now: +91-78920-09800
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
