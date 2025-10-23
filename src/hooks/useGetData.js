import { getData } from "@/lib/request";
import { useQuery } from "@tanstack/react-query";

export const useFetchQuery = (
  url,
  params,
  isBlob = false,
  enabled = true,
  queryKey
) => {
  return useQuery({
    queryKey: queryKey || [url, params],
    queryFn: async () => getData(url, params, isBlob),
    enabled,
  });
};
