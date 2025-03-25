import { useQuery } from "@tanstack/react-query";
import { getStoreSetting } from "../api/storeSettingApi";

export const useGetStoreSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getStoreSetting,
    staleTime: Infinity,
    // refetchOnWindowFocus: true,
  });
};
