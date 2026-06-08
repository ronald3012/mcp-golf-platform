#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import type { z } from "zod";

import { allTools } from "./tools/index.js";
import { ApiError } from "./apiClient.js";
import type { ToolContext, ToolDefinition } from "./tools/types.js";

const token = process.env.STAFF_JWT;
if (!token) {
  process.stderr.write(
    "[mcp-stdio] STAFF_JWT env var is required (the staff JWT signed with SECRET_JWT_SEED2)\n"
  );
  process.exit(1);
}

const ctx: ToolContext = { token };

const registerTool = (
  server: McpServer,
  tool: ToolDefinition<z.ZodRawShape>
): void => {
  const cb = async (args: unknown) => {
    try {
      const result = await tool.handler(args as never, ctx);
      return {
        content: [
          { type: "text" as const, text: JSON.stringify(result, null, 2) },
        ],
      };
    } catch (err) {
      const isApi = err instanceof ApiError;
      const status = isApi ? err.status : 500;
      const message = err instanceof Error ? err.message : String(err);
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

  (server.tool as unknown as (
    n: string,
    d: string,
    s: z.ZodRawShape,
    c: typeof cb
  ) => void)(tool.name, tool.description, tool.inputSchema, cb);
};

const server = new McpServer({ name: "iqtek-pairing", version: "1.0.0" });

for (const tool of allTools) {
  registerTool(server, tool as ToolDefinition<z.ZodRawShape>);
}

const transport = new StdioServerTransport();
server
  .connect(transport)
  .then(() => {
    process.stderr.write(
      `[mcp-stdio] iqtek-pairing listening on stdio, API: ${process.env.API_BASE_URL}\n`
    );
  })
  .catch((err: Error) => {
    process.stderr.write(`[mcp-stdio] connect failed: ${err.message}\n`);
    process.exit(1);
  });
