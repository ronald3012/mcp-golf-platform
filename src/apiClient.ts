import { config } from "./config.js";
import { logger } from "./logger.js";

export interface ApiCallOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  body?: unknown;
  query?: Record<string, string | number | undefined>;
  /** JWT del staff que vino en la request del cliente MCP. Va al API como x-token. */
  token: string;
}

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

export const apiCall = async <T = unknown>(
  opts: ApiCallOptions
): Promise<T> => {
  const url = new URL(opts.path, config.API_BASE_URL);
  if (opts.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      if (v !== undefined && v !== null && v !== "") {
        url.searchParams.set(k, String(v));
      }
    }
  }

  const headers: Record<string, string> = {
    "x-token": opts.token,
    "X-Mcp-Source": "1",
    Accept: "application/json",
  };
  if (opts.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.API_TIMEOUT_MS);

  logger.debug({ method: opts.method || "GET", url: url.toString() }, "apiCall");

  try {
    const res = await fetch(url, {
      method: opts.method || "GET",
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      signal: controller.signal,
    });

    const text = await res.text();
    let parsed: unknown;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = text;
    }

    if (!res.ok) {
      const msg =
        parsed && typeof parsed === "object" && "msg" in parsed
          ? String((parsed as { msg: unknown }).msg)
          : `HTTP ${res.status}`;
      throw new ApiError(res.status, msg, parsed);
    }

    return parsed as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new ApiError(
        504,
        `API call timed out after ${config.API_TIMEOUT_MS}ms`,
        null
      );
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
};
