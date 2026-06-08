"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const node_crypto_1 = require("node:crypto");
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const streamableHttp_js_1 = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const config_js_1 = require("./config.js");
const logger_js_1 = require("./logger.js");
const index_js_1 = require("./tools/index.js");
const apiClient_js_1 = require("./apiClient.js");
const registerTool = (server, tool, ctx) => {
    const cb = async (args) => {
        try {
            const result = await tool.handler(args, ctx);
            return {
                content: [
                    {
                        type: "text",
                        text: JSON.stringify(result, null, 2),
                    },
                ],
            };
        }
        catch (err) {
            const isApi = err instanceof apiClient_js_1.ApiError;
            const status = isApi ? err.status : 500;
            const message = err instanceof Error ? err.message : String(err);
            logger_js_1.logger.warn({ tool: tool.name, status, err: message }, "tool error");
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
    // SDK overload typing is overly strict; the runtime accepts our shape.
    server.tool(tool.name, tool.description, tool.inputSchema, cb);
};
const extractToken = (req) => {
    const auth = req.header("authorization");
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
        return auth.slice(7).trim();
    }
    const xToken = req.header("x-token");
    if (xToken)
        return xToken;
    return null;
};
const buildMcpServer = (ctx) => {
    const server = new mcp_js_1.McpServer({
        name: "iqtek-pairing",
        version: "1.0.0",
    });
    for (const tool of index_js_1.allTools) {
        registerTool(server, tool, ctx);
    }
    return server;
};
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "1mb" }));
app.get("/healthz", (_req, res) => {
    res.status(200).json({ ok: true, service: "iqtek-mcp-pairing" });
});
app.post("/mcp", async (req, res) => {
    const requestId = (0, node_crypto_1.randomUUID)();
    const reqLogger = logger_js_1.logger.child({ requestId });
    const token = extractToken(req);
    if (config_js_1.config.REQUIRE_AUTH && !token) {
        reqLogger.warn("missing auth on /mcp");
        res.status(401).json({
            jsonrpc: "2.0",
            error: { code: -32000, message: "Missing Authorization or x-token header" },
            id: null,
        });
        return;
    }
    const ctx = { token: token ?? "" };
    const server = buildMcpServer(ctx);
    const transport = new streamableHttp_js_1.StreamableHTTPServerTransport({
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
    }
    catch (err) {
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
const server = app.listen(config_js_1.config.MCP_PORT, () => {
    logger_js_1.logger.info({
        port: config_js_1.config.MCP_PORT,
        apiBaseUrl: config_js_1.config.API_BASE_URL,
        requireAuth: config_js_1.config.REQUIRE_AUTH,
    }, "MCP server listening");
});
const shutdown = (signal) => {
    logger_js_1.logger.info({ signal }, "shutting down");
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10000).unref();
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
//# sourceMappingURL=server.js.map