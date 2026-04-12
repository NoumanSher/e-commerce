"use client";
import React, { useState } from "react";
import { HiChevronDown } from "react-icons/hi2";

const faqs = [
  {
    question: "Do you offer delivery in Lahore?",
    answer: "Yes, we offer fast and reliable delivery across all areas of Lahore. Most orders are delivered within 24-48 hours.",
  },
  {
    question: "What are the shipping charges for Pakistan?",
    answer: "We offer free delivery for all orders over PKR 5000 throughout Pakistan. For orders below this amount, a flat shipping fee applies.",
  },
  {
    question: "How can I track my order?",
    answer: "Once your order is shipped, you will receive a tracking number via WhatsApp or Email. You can use this number to track your package in real-time.",
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 15-day money-back guarantee. If you are not satisfied with your purchase, you can return it within 15 days for a full refund or exchange.",
  },
  {
    question: "Are your products authentic?",
    answer: "Absolutely. At PakShipper, we pride ourselves on offering only 100% authentic and high-quality products sourced directly from trusted manufacturers.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-16 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-[26px] xl:text-[32px] font-bold tracking-tight text-gray-900 mb-2">
            Frequently Asked Questions
          </h2>
          <div className="flex justify-center mt-1">
            <span className="block w-10 h-[2px] bg-black rounded-full" />
          </div>
          <p className="text-gray-500 mt-4">
            Everything you need to know about shopping with PakShipper in Lahore and Pakistan.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border-b border-gray-100 pb-4 transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full text-left py-4 focus:outline-none group"
              >
                <span className="text-lg font-medium text-gray-800 group-hover:text-black transition-colors">
                  {faq.question}
                </span>
                <HiChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180 text-black" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-gray-600 leading-relaxed pb-2">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
