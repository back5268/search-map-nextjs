import { checkJson } from "./helper";

export const getData = async (url, params, isBlob) => {
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

export const postData = async (url, params, isUpload) => {
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
      method: "POST",
      body: data,
    });
  } else {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
  }
  
  if (!res.ok) {
    const text = checkJson(await res.text())
    text.status = 0;
    return text;
  } else {
    const text = checkJson(await res.text())
    text.status = 1;
    return text;
  }
};
