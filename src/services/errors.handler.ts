import { AxiosError } from "axios";

export const handleError = (error: AxiosError) => {
  if (error.code === "ERR_CANCELED") return { cause: null };
  return error;
};
