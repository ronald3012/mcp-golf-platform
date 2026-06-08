import { config as loadEnv } from "dotenv";
import { z } from "zod";

loadEnv();

const ConfigSchema = z.object({
  MCP_PORT: z.coerce.number().int().positive().default(4101),
  API_BASE_URL: z.string().url(),
  API_TIMEOUT_MS: z.coerce.number().int().positive().default(15000),
  LOG_LEVEL: z
    .enum(["trace", "debug", "info", "warn", "error", "fatal"])
    .default("info"),
  REQUIRE_AUTH: z
    .enum(["true", "false"])
    .default("true")
    .transform((v) => v === "true"),
});

const parsed = ConfigSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("[config] Invalid env vars:", parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = parsed.data;
