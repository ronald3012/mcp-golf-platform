"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.revertPairAuditTool = void 0;
const zod_1 = require("zod");
const apiClient_js_1 = require("../apiClient.js");
const inputSchema = {
    audit_id: zod_1.z
        .number()
        .int()
        .positive()
        .describe("ID del audit log a revertir (obtenido de list_pair_audit o de la respuesta de pair/unpair)."),
    reason: zod_1.z
        .string()
        .optional()
        .describe("Justificación del revert."),
};
exports.revertPairAuditTool = {
    name: "revert_pair_audit",
    description: [
        "Deshace una operación previa (pair o unpair) por su ID de audit.",
        "Reglas:",
        "- 404 si el audit_id no existe.",
        "- 409 si el audit ya fue revertido previamente (no se permite doble revert).",
        "- 409 si el audit original es ya un revert (no se revierten reverts; re-aplicar la operación original).",
        "- 409 si algún jugador involucrado está ahora en un foursome activo.",
        "Restaura el estado anterior, incluyendo los orphans registrados en side_effects.",
    ].join("\n"),
    inputSchema,
    handler: async (args, ctx) => (0, apiClient_js_1.apiCall)({
        method: "POST",
        path: `/api/person/pair-audit/${args.audit_id}/revert`,
        body: args.reason ? { reason: args.reason } : undefined,
        token: ctx.token,
    }),
};
//# sourceMappingURL=revertPairAudit.js.map