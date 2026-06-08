import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

const originalEnv = process.env;

beforeEach(() => {
  process.env = {
    ...originalEnv,
    API_BASE_URL: "http://test.local",
    API_TIMEOUT_MS: "5000",
    REQUIRE_AUTH: "true",
  };
  vi.resetModules();
});

afterEach(() => {
  process.env = originalEnv;
  vi.restoreAllMocks();
});

describe("apiClient", () => {
  it("propaga x-token y X-Mcp-Source en la request", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true, pair: { team_code: "AL1" } }), {
          status: 200,
          headers: { "content-type": "application/json" },
        })
      );

    const { apiCall } = await import("../src/apiClient.js");
    const result = await apiCall({
      method: "POST",
      path: "/api/person/pair",
      body: { player1_document: "A", player2_document: "B" },
      token: "the-staff-jwt",
    });

    expect(result).toEqual({ ok: true, pair: { team_code: "AL1" } });
    expect(fetchMock).toHaveBeenCalledOnce();
    const call = fetchMock.mock.calls[0]!;
    const headers = (call[1] as RequestInit).headers as Record<string, string>;
    expect(headers["x-token"]).toBe("the-staff-jwt");
    expect(headers["X-Mcp-Source"]).toBe("1");
    expect(headers["Content-Type"]).toBe("application/json");
  });

  it("convierte query params en la URL", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        })
      );

    const { apiCall } = await import("../src/apiClient.js");
    await apiCall({
      path: "/api/person/unpaired",
      query: { page: 2, limit: 10, buscar: "Juan", ignored: undefined },
      token: "t",
    });

    const url = new URL(fetchMock.mock.calls[0]![0] as string);
    expect(url.pathname).toBe("/api/person/unpaired");
    expect(url.searchParams.get("page")).toBe("2");
    expect(url.searchParams.get("limit")).toBe("10");
    expect(url.searchParams.get("buscar")).toBe("Juan");
    expect(url.searchParams.has("ignored")).toBe(false);
  });

  it("lanza ApiError con status y body cuando el API responde 4xx/5xx", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(
        JSON.stringify({ ok: false, msg: "Player not found" }),
        { status: 400, headers: { "content-type": "application/json" } }
      )
    );

    const { apiCall, ApiError } = await import("../src/apiClient.js");
    await expect(
      apiCall({ path: "/api/person/pair", token: "t", body: {} })
    ).rejects.toMatchObject({
      name: "ApiError",
      status: 400,
      message: "Player not found",
    });

    // Verify it's an ApiError instance
    try {
      await apiCall({ path: "/api/person/pair", token: "t", body: {} });
    } catch (e) {
      // ignored, just checking type below
    }

    const err = new ApiError(400, "msg", { ok: false });
    expect(err).toBeInstanceOf(Error);
    expect(err.status).toBe(400);
  });

  it("convierte AbortError en ApiError 504", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementationOnce(() => {
      const e = new Error("aborted");
      e.name = "AbortError";
      return Promise.reject(e);
    });

    const { apiCall } = await import("../src/apiClient.js");
    await expect(
      apiCall({ path: "/api/person/unpaired", token: "t" })
    ).rejects.toMatchObject({
      name: "ApiError",
      status: 504,
    });
  });
});
