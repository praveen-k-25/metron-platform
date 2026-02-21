import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { attachAbortController, clearAbortController } from "./contollers";
import { BASE_URL } from "@/config/env";
import { handleError } from "./errors.handler";

interface AbortAxiosResponse extends InternalAxiosRequestConfig {
  _cancelToken: string;
}

const metronApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

metronApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // atach abort controller to the request
    attachAbortController(config);

    return config;
  },
  (error: AxiosError) => Promise.reject(handleError(error)),
);

metronApi.interceptors.response.use(
  (response: AxiosResponse) => {
    // clear abort controller
    clearAbortController(response.config as AbortAxiosResponse);
    return response;
  },
  (error: AxiosError) => {
    // clear abort controller
    clearAbortController(error.config as AbortAxiosResponse);
    return Promise.reject(handleError(error));
  },
);

export default metronApi;
