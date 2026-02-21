import { AxiosError } from "axios";

export const handleError = (error: AxiosError) => {
  if (error.code === "ERR_CANCELED") return { cancelled: true };
  if (error.response?.data) {
    return error.response.data;
  }
  return error;
};
