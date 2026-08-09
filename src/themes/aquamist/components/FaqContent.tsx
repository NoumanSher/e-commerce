"use client";

import React, { useState } from "react";
import { useFaqsQuery } from "@/hooks/useFaqsQuery";

export default function AquaMistFaqContent() {
  const { data: faqs, isLoading } = useFaqsQuery();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const displayFaqs = (faqs || []).filter((faq) => faq.isActive);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="flex-grow pt-[120px] pb-24 px-5 md:px-20 max-w-[1280px] mx-auto w-full">
      {/* Page Header */}
      <header className="text-center mb-16">
        <span className="inline-block font-inter text-[14px] font-semibold tracking-[0.2em] text-aq-primary mb-3 uppercase">
          Support
        </span>
        <h1 className="font-eb-garamond text-[40px] md:text-[48px] leading-tight text-aq-on-surface mb-4">
          FAQ & Help Center
        </h1>
        <p className="font-inter text-[18px] leading-[28px] text-aq-on-surface/70 max-w-2xl mx-auto">
          Have questions? We’ve got answers. Find information about shipping, orders, care instructions, and more.
        </p>
      </header>

      {/* Accordion List */}
      <div className="max-w-3xl mx-auto space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-aq-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : displayFaqs.length === 0 ? (
          <div className="text-center py-12 text-aq-on-surface-variant font-inter">
            No frequently asked questions found.
          </div>
        ) : (
          displayFaqs.map((faq, index) => {
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
                    isOpen ? "max-h-[800px] border-t border-white/5" : "max-h-0"
                  }`}
                >
                  <div className="px-6 py-5 font-inter text-sm text-aq-on-surface-variant leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
