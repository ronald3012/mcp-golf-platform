"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = require("dotenv");
const zod_1 = require("zod");
(0, dotenv_1.config)();
const ConfigSchema = zod_1.z.object({
    MCP_PORT: zod_1.z.coerce.number().int().positive().default(4101),
    API_BASE_URL: zod_1.z.string().url(),
    API_TIMEOUT_MS: zod_1.z.coerce.number().int().positive().default(15000),
    LOG_LEVEL: zod_1.z
        .enum(["trace", "debug", "info", "warn", "error", "fatal"])
        .default("info"),
    REQUIRE_AUTH: zod_1.z
        .enum(["true", "false"])
        .default("true")
        .transform((v) => v === "true"),
});
const parsed = ConfigSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("[config] Invalid env vars:", parsed.error.flatten().fieldErrors);
    process.exit(1);
}
exports.config = parsed.data;
//# sourceMappingURL=config.js.map