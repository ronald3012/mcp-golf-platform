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

describe("tools", () => {
  it("pair_players llama POST /api/person/pair con el body correcto", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ ok: true, pair: { team_code: "AL999" } }),
          { status: 200, headers: { "content-type": "application/json" } }
        )
      );

    const { pairPlayersTool } = await import("../src/tools/pairPlayers.js");
    const result = await pairPlayersTool.handler(
      {
        player1_document: "DOC1",
        player2_document: "DOC2",
        reason: "test",
      },
      { token: "tok" }
    );

    expect(result).toEqual({ ok: true, pair: { team_code: "AL999" } });
    const call = fetchMock.mock.calls[0]!;
    expect((call[1] as RequestInit).method).toBe("POST");
    expect((call[0] as URL).toString()).toBe(
      "http://test.local/api/person/pair"
    );
    expect((call[1] as RequestInit).body).toBe(
      JSON.stringify({
        player1_document: "DOC1",
        player2_document: "DOC2",
        reason: "test",
      })
    );
  });

  it("unpair_player encodea el documento en la URL", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        })
      );

    const { unpairPlayerTool } = await import("../src/tools/unpairPlayer.js");
    await unpairPlayerTool.handler(
      { document: "DOC/CON ESPACIO" },
      { token: "tok" }
    );

    const url = (fetchMock.mock.calls[0]![0] as URL).toString();
    expect(url).toContain("/api/person/DOC%2FCON%20ESPACIO/unpair");
  });

  it("revert_pair_audit usa POST con audit_id en URL", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "content-type": "application/json" },
        })
      );

    const { revertPairAuditTool } = await import(
      "../src/tools/revertPairAudit.js"
    );
    await revertPairAuditTool.handler(
      { audit_id: 42, reason: "rollback" },
      { token: "tok" }
    );

    const url = (fetchMock.mock.calls[0]![0] as URL).toString();
    expect(url).toContain("/api/person/pair-audit/42/revert");
    expect((fetchMock.mock.calls[0]![1] as RequestInit).body).toBe(
      JSON.stringify({ reason: "rollback" })
    );
  });

  it("list_unpaired_players envía query params", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ ok: true, players: [] }), {
          status: 200,
          headers: { "content-type": "application/json" },
        })
      );

    const { listUnpairedPlayersTool } = await import(
      "../src/tools/listUnpairedPlayers.js"
    );
    await listUnpairedPlayersTool.handler(
      { page: 2, limit: 5, buscar: "Juan" },
      { token: "tok" }
    );

    const url = new URL(fetchMock.mock.calls[0]![0] as string);
    expect(url.searchParams.get("page")).toBe("2");
    expect(url.searchParams.get("limit")).toBe("5");
    expect(url.searchParams.get("buscar")).toBe("Juan");
  });
});
