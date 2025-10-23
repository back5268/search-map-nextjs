import { checkJson } from "@/lib/helper";
import { useQuery } from "@tanstack/react-query";

const getData = async (url, params, isBlob) => {
  const query = params ? `?${new URLSearchParams(params).toString()}` : "";
  const res = await fetch(`${url}${query}`, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) {
    const text = checkJson(await res.text());
    text.status = 0;
    return text;
  } else if (!isBlob) {
    const text = checkJson(await res.text());
    text.status = 1;
    return text;
  }
  if (isBlob) {
    const blob = await res.blob();
    return blob;
  }
};

export const useGetData = (
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
