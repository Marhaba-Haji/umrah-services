import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";

interface Faq {
  id: number;
  question: string;
  answer: string;
  seo_title?: string | null;
  seo_description?: string | null;
  keywords?: string[] | null;
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

const FAQSection = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("faqs")
        .select("id, question, answer, seo_title, seo_description, keywords")
        .eq("page", "faqs");
      if (!error && data) setFaqs(data);
      setLoading(false);
    };
    fetchFaqs();
  }, []);

  useEffect(() => {
    if (!loading && faqs.length > 0) {
      injectFAQJsonLD(faqs);
    }
  }, [loading, faqs]);

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
                  <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-emerald-600">
                    {faq.seo_title || faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-700 leading-relaxed pt-2">
                    {faq.seo_description || faq.answer}
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
