"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const config_js_1 = require("./config.js");
// stderr (fd=2) so stdio MCP transport on stdout stays clean.
exports.logger = (0, pino_1.default)({
    level: config_js_1.config.LOG_LEVEL,
    base: { service: "iqtek-mcp-pairing" },
    timestamp: pino_1.default.stdTimeFunctions.isoTime,
}, pino_1.default.destination(2));
//# sourceMappingURL=logger.js.map