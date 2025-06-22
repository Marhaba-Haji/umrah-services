
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const FAQSection = () => {
  const faqs = [
    {
      question: "What is an Umrah visa and who needs it?",
      answer: "An Umrah visa is a special entry permit for Saudi Arabia that allows Muslim pilgrims to perform the Umrah pilgrimage to Mecca and Medina. All foreign nationals (except GCC citizens) need an Umrah visa to enter Saudi Arabia for religious purposes. The visa is different from a regular tourist visa and has specific requirements and validity periods."
    },
    {
      question: "How long does Umrah visa processing take?",
      answer: "Standard processing takes 3-5 business days, while our express service can process your visa in 24-48 hours. Processing times may vary depending on your nationality, the completeness of your application, and the current volume of applications. We provide real-time updates throughout the process so you're always informed of your application status."
    },
    {
      question: "What documents do I need for an Umrah visa application?",
      answer: "You'll need: (1) Passport with at least 6 months validity and 2 blank pages, (2) Recent passport-size photos with white background, (3) Completed application form, (4) Proof of vaccination (Meningitis, COVID-19 as per current requirements), (5) Travel itinerary, (6) Proof of accommodation in Saudi Arabia, and (7) Return flight tickets. Additional documents may be required based on your nationality."
    },
    {
      question: "How much does an Umrah visa cost?",
      answer: "Umrah visa costs vary by nationality and processing speed. Prices range from $99-$159 for standard processing (3-5 days), $179-$259 for express processing (24-48 hours), and $219-$309 for multiple entry visas. Our prices include all service fees, document verification, and 24/7 support. There are no hidden charges."
    },
    {
      question: "What's the difference between single and multiple entry Umrah visas?",
      answer: "A single entry visa allows one entry to Saudi Arabia and is valid for 30 days from the date of issue. A multiple entry visa allows multiple visits within one year and each stay can be up to 30 days. Multiple entry visas are ideal for frequent pilgrims or those planning to visit during different Islamic calendar months."
    },
    {
      question: "Can I extend my Umrah visa once I'm in Saudi Arabia?",
      answer: "Umrah visas typically cannot be extended beyond their validity period. However, you may be able to exit and re-enter with a multiple entry visa. For specific extension requirements or emergency situations, contact the Saudi immigration authorities or our 24/7 support team for guidance on available options."
    },
    {
      question: "What happens if my Umrah visa application is rejected?",
      answer: "Visa rejections are rare when applications are properly prepared. Common rejection reasons include incomplete documents, photo non-compliance, or passport validity issues. If rejection occurs due to our error, we offer a 100% money-back guarantee. If it's due to missing documents, we'll help you reapply with correct documentation at no additional service charge."
    },
    {
      question: "Do I need to book hotels and flights before applying for an Umrah visa?",
      answer: "Yes, you typically need to provide proof of accommodation and return flight tickets as part of your visa application. However, we recommend booking refundable options until your visa is approved. Many hotels and airlines offer flexible booking policies for pilgrims. Our team can guide you on the best booking strategies."
    },
    {
      question: "Are there any age restrictions for Umrah visa applications?",
      answer: "There are no specific age restrictions for Umrah visas. However, minors (under 18) must be accompanied by a parent or guardian and require additional documentation including birth certificates and parental consent letters. Elderly pilgrims should ensure they meet health requirements and have appropriate travel insurance."
    },
    {
      question: "What COVID-19 requirements are there for Umrah visa applications?",
      answer: "COVID-19 requirements change frequently. Currently, most travelers need proof of vaccination with WHO-approved vaccines. Some nationalities may require additional health certificates or testing. We stay updated with the latest health requirements and will inform you of any specific requirements for your nationality during the application process."
    },
    {
      question: "Can I perform Umrah during Hajj season?",
      answer: "Umrah visas are typically not issued during the official Hajj period (usually 1-2 months around Hajj season). The exact dates vary each year based on the Islamic lunar calendar. During this time, only Hajj visas are issued. We recommend planning your Umrah visit outside the Hajj season for visa availability."
    },
    {
      question: "How do I track my Umrah visa application status?",
      answer: "Once you submit your application, you'll receive a unique tracking number via email and SMS. You can check your application status 24/7 through our online portal, mobile app, or by contacting our support team. We also send automatic updates when your application moves to different processing stages."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions About Umrah Visas
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get answers to the most common questions about Umrah visa applications, requirements, 
            and the pilgrimage process. Can't find what you're looking for? Contact our experts.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-gray-200 rounded-lg px-6 py-2 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold text-gray-900 hover:text-emerald-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 leading-relaxed pt-2">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16">
          <div className="bg-emerald-50 rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-600 mb-6">
              Our visa experts are available 24/7 to help with your Umrah visa application. 
              Get personalized assistance in multiple languages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                💬 Chat with Expert
              </button>
              <button className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-6 py-3 rounded-lg font-medium transition-colors">
                📞 Call Now: +1-234-567-8900
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
