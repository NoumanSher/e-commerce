import { get } from "@/lib/apiClient";

export interface Faq {
  _id: string;
  question: string;
  answer: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Client-side: fetch store FAQs.
 */
const getFaqs = async (): Promise<Faq[]> => {
  const url = "/faqs";
  try {
    return await get<Faq[]>(url);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
};

export const faqService = {
  getFaqs,
};
