"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPairAuditTool = void 0;
const zod_1 = require("zod");
const apiClient_js_1 = require("../apiClient.js");
const inputSchema = {
    page: zod_1.z.number().int().positive().optional(),
    limit: zod_1.z.number().int().positive().max(200).optional(),
    actor_uid: zod_1.z
        .string()
        .optional()
        .describe("Filtrar por staff uid que disparó la operación."),
    player_doc: zod_1.z
        .string()
        .optional()
        .describe("Filtrar por cédula de un jugador involucrado."),
    from: zod_1.z
        .string()
        .optional()
        .describe("Fecha desde (formato YYYY-MM-DD o ISO 8601)."),
    to: zod_1.z.string().optional().describe("Fecha hasta."),
};
exports.listPairAuditTool = {
    name: "list_pair_audit",
    description: "Lista el historial completo de operaciones de pair/unpair/revert. Cada row incluye actor, action, before/after, side_effects y reverted_by_audit_id. Útil para investigar quién hizo qué y para encontrar audit_ids a revertir.",
    inputSchema,
    handler: async (args, ctx) => (0, apiClient_js_1.apiCall)({
        path: "/api/person/pair-audit",
        query: args,
        token: ctx.token,
    }),
};
//# sourceMappingURL=listPairAudit.js.map