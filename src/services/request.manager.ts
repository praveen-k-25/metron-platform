import metronApi from "./api.instance";

type method = "get" | "post" | "put" | "delete";
type requestData = object | null;

async function apiRequest<T>(
  method: method,
  url: string,
  data: requestData,
  formData: boolean,
) {
  const config = {
    headers: {
      "Content-Type": formData ? "multipart/form-data" : "application/json",
    },
    method,
    url,
    data,
  };

  try {
    const response = await metronApi(config);
    return response.data as T;
  } catch (error: any) {
    return Promise.reject(error.response.data);
  }
}

export default apiRequest;
