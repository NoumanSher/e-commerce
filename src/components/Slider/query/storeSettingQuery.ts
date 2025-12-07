import { useQuery } from "@tanstack/react-query";
import { getStoreSetting } from "../api/storeSettingApi";
import { queryKeys } from "@/lib/queryKeys";
import { STALE_TIMES } from "@/lib/queryClient";

export const useGetStoreSettings = () => {
  return useQuery({
    queryKey: queryKeys.store.settings(),
    queryFn: getStoreSetting,
    staleTime: STALE_TIMES.infinite, // Store settings rarely change
  });
};
