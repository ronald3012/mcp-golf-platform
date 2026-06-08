#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const index_js_1 = require("./tools/index.js");
const apiClient_js_1 = require("./apiClient.js");
const token = process.env.STAFF_JWT;
if (!token) {
    process.stderr.write("[mcp-stdio] STAFF_JWT env var is required (the staff JWT signed with SECRET_JWT_SEED2)\n");
    process.exit(1);
}
const ctx = { token };
const registerTool = (server, tool) => {
    const cb = async (args) => {
        try {
            const result = await tool.handler(args, ctx);
            return {
                content: [
                    { type: "text", text: JSON.stringify(result, null, 2) },
                ],
            };
        }
        catch (err) {
            const isApi = err instanceof apiClient_js_1.ApiError;
            const status = isApi ? err.status : 500;
            const message = err instanceof Error ? err.message : String(err);
            return {
                isError: true,
                content: [
                    {
                        type: "text",
                        text: JSON.stringify({
                            error: true,
                            status,
                            message,
                            body: isApi ? err.body : null,
                        }, null, 2),
                    },
                ],
            };
        }
    };
    server.tool(tool.name, tool.description, tool.inputSchema, cb);
};
const server = new mcp_js_1.McpServer({ name: "iqtek-pairing", version: "1.0.0" });
for (const tool of index_js_1.allTools) {
    registerTool(server, tool);
}
const transport = new stdio_js_1.StdioServerTransport();
server
    .connect(transport)
    .then(() => {
    process.stderr.write(`[mcp-stdio] iqtek-pairing listening on stdio, API: ${process.env.API_BASE_URL}\n`);
})
    .catch((err) => {
    process.stderr.write(`[mcp-stdio] connect failed: ${err.message}\n`);
    process.exit(1);
});
//# sourceMappingURL=server-stdio.js.map