import pino from "pino";
import { config } from "./config.js";

// stderr (fd=2) so stdio MCP transport on stdout stays clean.
export const logger = pino(
  {
    level: config.LOG_LEVEL,
    base: { service: "iqtek-mcp-pairing" },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  pino.destination(2)
);

export type Logger = typeof logger;
