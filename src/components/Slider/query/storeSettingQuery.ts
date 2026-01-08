import { useQuery } from "@tanstack/react-query";
import { settingsService } from "@/services/settingsService";
import { queryKeys } from "@/lib/queryKeys";
import { STALE_TIMES } from "@/lib/queryClient";

export const useGetStoreSettings = () => {
  return useQuery({
    queryKey: queryKeys.store.settings(),
    queryFn: () => settingsService.getStoreSetting(),
    staleTime: STALE_TIMES.infinite, // Store settings rarely change
  });
};
