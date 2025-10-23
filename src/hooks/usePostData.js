import { postData } from "@/lib/request";
import { useMutation } from "@tanstack/react-query";

export const usePostData = (url, isUpload = false, onSuccess, onError) => {
  return useMutation({
    mutationFn: (params) => postData(url, params, isUpload),
    onSuccess,
    onError,
  });
};
