import { useSearchParams } from "next/navigation";

export const useGetParams = () => {
  const searchParams = useSearchParams();
  const queryObj = Object.fromEntries(searchParams.entries());
  const params = {};
  params.page = 1;
  params.limit = 10;
  for (let key in queryObj) {
    const value = queryObj[key];
    if (value.includes(",")) {
      const array = value.split(",");
      params[key] = array.map((a) =>
        Number(a) || Number(a) === 0 ? Number(a) : a
      );
    } else
      params[key] =
        Number(value) || Number(value) === 0 ? Number(value) : value;
  }
  return params;
};
