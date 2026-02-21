import { InternalAxiosRequestConfig } from "axios";

const controllers = new Map<string, AbortController>();

function createRequestKey(config: InternalAxiosRequestConfig): string {
  const { url, method, data } = config;
  return JSON.stringify({ url, method, data });
}

export function attachAbortController(config: InternalAxiosRequestConfig) {
  const key = createRequestKey(config);

  if (controllers.has(key)) {
    controllers.get(key)?.abort();
  }

  const controller = new AbortController();
  controllers.set(key, controller);
  config.signal = controller.signal;
  (config as any)._cancelToken = key;
}

export function clearAbortController(config: InternalAxiosRequestConfig) {
  const key = (config as any)._cancelToken;
  if (key) {
    controllers.delete(key);
  }
}
