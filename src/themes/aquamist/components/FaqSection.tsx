"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useFaqsQuery } from "@/hooks/useFaqsQuery";

export default function AquaMistFaqSection() {
  const { data: faqs, isLoading } = useFaqsQuery();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (isLoading) {
    return (
      <section className="py-24 px-5 md:px-20 max-w-[1280px] mx-auto text-center">
        <div className="inline-block w-8 h-8 border-2 border-aq-primary border-t-transparent rounded-full animate-spin"></div>
      </section>
    );
  }

  // Filter active and limit to top 5 for the homepage section
  const displayFaqs = (faqs || []).filter((faq) => faq.isActive).slice(0, 5);

  if (displayFaqs.length === 0) {
    return null; // Don't render if there are no FAQs
  }

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: displayFaqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };

  return (
    <section className="py-24 px-5 md:px-20 max-w-[1280px] mx-auto relative z-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="text-center mb-16">
        <span className="text-aq-primary font-inter text-[14px] tracking-[0.2em] font-semibold block mb-4 uppercase">
          Questions
        </span>
        <h2 className="font-eb-garamond text-[36px] md:text-[44px] leading-tight text-aq-on-surface">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="max-w-3xl mx-auto space-y-4">
        {displayFaqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={faq._id}
              className="aq-glass-card rounded-[20px] overflow-hidden transition-all duration-300 border border-white/5 hover:border-white/10"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full text-left px-6 py-5 flex justify-between items-center gap-4 focus:outline-none"
              >
                <span className="font-eb-garamond text-lg md:text-xl text-aq-on-surface">
                  {faq.question}
                </span>
                <span className={`material-symbols-outlined text-aq-primary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
                  expand_more
                </span>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpen ? "max-h-[500px] border-t border-white/5" : "max-h-0"
                }`}
              >
                <div className="px-6 py-5 font-inter text-sm text-aq-on-surface-variant leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {(faqs || []).length > 5 && (
        <div className="text-center mt-12">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 font-inter text-sm font-semibold tracking-wider text-aq-primary hover:text-aq-primary/80 transition-colors uppercase"
          >
            View All FAQs
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      )}
    </section>
  );
}
