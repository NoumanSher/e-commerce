import { useQuery } from "@tanstack/react-query";
import { faqService } from "@/services/faqService";
import { queryKeys } from "@/lib/queryKeys";
import { STALE_TIMES } from "@/lib/queryClient";

export const useFaqsQuery = () => {
  return useQuery({
    queryKey: queryKeys.faqs.all(),
    queryFn: () => faqService.getFaqs(),
    staleTime: STALE_TIMES.medium, // FAQs change occasionally, medium cache is appropriate
  });
};
