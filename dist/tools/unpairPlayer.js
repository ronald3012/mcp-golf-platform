"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpairPlayerTool = void 0;
const zod_1 = require("zod");
const apiClient_js_1 = require("../apiClient.js");
const inputSchema = {
    document: zod_1.z
        .string()
        .min(1)
        .describe("Cédula del jugador a desemparejar."),
    reason: zod_1.z
        .string()
        .optional()
        .describe("Justificación del unpair. Se persiste en el audit log."),
};
exports.unpairPlayerTool = {
    name: "unpair_player",
    description: [
        "Desempareja un jugador. Si tenía pareja, AMBOS quedan sin team_code.",
        "Reglas:",
        "- 404 si el jugador no existe.",
        "- 400 si el jugador no tiene team (nada que desemparejar).",
        "- 409 si el jugador está en un foursome activo.",
        "Operación revertible vía revert_pair_audit.",
    ].join("\n"),
    inputSchema,
    handler: async (args, ctx) => (0, apiClient_js_1.apiCall)({
        method: "POST",
        path: `/api/person/${encodeURIComponent(args.document)}/unpair`,
        body: args.reason ? { reason: args.reason } : undefined,
        token: ctx.token,
    }),
};
//# sourceMappingURL=unpairPlayer.js.map