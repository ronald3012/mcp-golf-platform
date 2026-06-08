"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiCall = exports.ApiError = void 0;
const config_js_1 = require("./config.js");
const logger_js_1 = require("./logger.js");
class ApiError extends Error {
    status;
    body;
    constructor(status, message, body) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.body = body;
    }
}
exports.ApiError = ApiError;
const apiCall = async (opts) => {
    const url = new URL(opts.path, config_js_1.config.API_BASE_URL);
    if (opts.query) {
        for (const [k, v] of Object.entries(opts.query)) {
            if (v !== undefined && v !== null && v !== "") {
                url.searchParams.set(k, String(v));
            }
        }
    }
    const headers = {
        "x-token": opts.token,
        "X-Mcp-Source": "1",
        Accept: "application/json",
    };
    if (opts.body !== undefined) {
        headers["Content-Type"] = "application/json";
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), config_js_1.config.API_TIMEOUT_MS);
    logger_js_1.logger.debug({ method: opts.method || "GET", url: url.toString() }, "apiCall");
    try {
        const res = await fetch(url, {
            method: opts.method || "GET",
            headers,
            body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
            signal: controller.signal,
        });
        const text = await res.text();
        let parsed;
        try {
            parsed = text ? JSON.parse(text) : null;
        }
        catch {
            parsed = text;
        }
        if (!res.ok) {
            const msg = parsed && typeof parsed === "object" && "msg" in parsed
                ? String(parsed.msg)
                : `HTTP ${res.status}`;
            throw new ApiError(res.status, msg, parsed);
        }
        return parsed;
    }
    catch (err) {
        if (err instanceof ApiError)
            throw err;
        if (err instanceof Error && err.name === "AbortError") {
            throw new ApiError(504, `API call timed out after ${config_js_1.config.API_TIMEOUT_MS}ms`, null);
        }
        throw err;
    }
    finally {
        clearTimeout(timer);
    }
};
exports.apiCall = apiCall;
//# sourceMappingURL=apiClient.js.map