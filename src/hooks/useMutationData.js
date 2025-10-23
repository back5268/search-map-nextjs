import { checkJson } from "@/lib/helper";
import { useMutation } from "@tanstack/react-query";

export const postData = async (url, method, params, isUpload) => {
  let res;
  if (isUpload) {
    const { formData, ...param } = params;
    const data = new FormData();
    if (formData && typeof formData === "object") {
      for (const key in formData) {
        const value = formData[key];
        if (Array.isArray(value)) {
          value.forEach((v) => data.append(key, v));
        } else if (value !== undefined && value !== null) {
          data.append(key, value);
        }
      }
    }

    for (const key in param) {
      const value = param[key];
      if (value === undefined || value === null) continue;
      if (typeof value === "object") data.append(key, JSON.stringify(value));
      else data.append(key, value);
    }

    res = await fetch(url, {
      method,
      body: data,
    });
  } else {
    res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
  }

  if (!res.ok) {
    const text = checkJson(await res.text());
    text.status = 0;
    return text;
  } else {
    const text = checkJson(await res.text());
    text.status = 1;
    return text;
  }
};

export const deleteData = async (url, params) => {
  const res = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const text = checkJson(await res.text());
  text.status = res.ok ? 1 : 0;
  return text;
};

export const useMutationData = (
  url,
  method = "POST",
  isUpload = false,
  onSuccess,
  onError
) => {
  return useMutation({
    mutationFn: (params) =>
      method === "DELETE"
        ? deleteData(url, params)
        : postData(url, method, params, isUpload),
    onSuccess,
    onError,
  });
};
