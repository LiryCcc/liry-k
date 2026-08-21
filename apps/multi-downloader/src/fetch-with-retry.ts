import { sleep } from './sleep.js';

export type FetchWithRetryOptions = {
  retries: number;
  retryDelayMs: number;
  init?: RequestInit;
};

const fetchWithRetry = async (url: string, options: FetchWithRetryOptions): Promise<Response> => {
  const { retries, retryDelayMs, init } = options;
  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await fetch(url, init);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      return response;
    } catch (error) {
      lastError = error;

      if (attempt < retries) {
        await sleep(retryDelayMs * (attempt + 1));
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error(String(lastError));
};

export { fetchWithRetry };
