import express, { type Request, type Response } from "express";
import { randomUUID } from "node:crypto";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import type { z } from "zod";

import { config } from "./config.js";
import { logger } from "./logger.js";
import { allTools } from "./tools/index.js";
import { ApiError } from "./apiClient.js";
import type { ToolContext, ToolDefinition } from "./tools/types.js";

const registerTool = (
  server: McpServer,
  tool: ToolDefinition<z.ZodRawShape>,
  ctx: ToolContext
): void => {
  const cb = async (args: unknown) => {
    try {
      const result = await tool.handler(args as never, ctx);
      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (err) {
      const isApi = err instanceof ApiError;
      const status = isApi ? err.status : 500;
      const message = err instanceof Error ? err.message : String(err);
      logger.warn({ tool: tool.name, status, err: message }, "tool error");
      return {
        isError: true,
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(
              {
                error: true,
                status,
                message,
                body: isApi ? err.body : null,
              },
              null,
              2
            ),
          },
        ],
      };
    }
  };

  // SDK overload typing is overly strict; the runtime accepts our shape.
  (server.tool as unknown as (
    n: string,
    d: string,
    s: z.ZodRawShape,
    c: typeof cb
  ) => void)(tool.name, tool.description, tool.inputSchema, cb);
};

const extractToken = (req: Request): string | null => {
  const auth = req.header("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim();
  }
  const xToken = req.header("x-token");
  if (xToken) return xToken;
  return null;
};

const buildMcpServer = (ctx: ToolContext): McpServer => {
  const server = new McpServer({
    name: "iqtek-pairing",
    version: "1.0.0",
  });

  for (const tool of allTools) {
    registerTool(server, tool as ToolDefinition<z.ZodRawShape>, ctx);
  }

  return server;
};

const app = express();
app.use(express.json({ limit: "1mb" }));

app.get("/healthz", (_req, res) => {
  res.status(200).json({ ok: true, service: "iqtek-mcp-pairing" });
});

app.post("/mcp", async (req: Request, res: Response) => {
  const requestId = randomUUID();
  const reqLogger = logger.child({ requestId });

  const token = extractToken(req);
  if (config.REQUIRE_AUTH && !token) {
    reqLogger.warn("missing auth on /mcp");
    res.status(401).json({
      jsonrpc: "2.0",
      error: { code: -32000, message: "Missing Authorization or x-token header" },
      id: null,
    });
    return;
  }

  const ctx: ToolContext = { token: token ?? "" };

  const server = buildMcpServer(ctx);
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  res.on("close", () => {
    transport.close();
    server.close();
  });

  try {
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (err) {
    reqLogger.error({ err: err instanceof Error ? err.message : err }, "mcp handler error");
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal MCP error" },
        id: null,
      });
    }
  }
});

const server = app.listen(config.MCP_PORT, () => {
  logger.info(
    {
      port: config.MCP_PORT,
      apiBaseUrl: config.API_BASE_URL,
      requireAuth: config.REQUIRE_AUTH,
    },
    "MCP server listening"
  );
});

const shutdown = (signal: string) => {
  logger.info({ signal }, "shutting down");
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
