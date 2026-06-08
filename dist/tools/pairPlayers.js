"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pairPlayersTool = void 0;
const zod_1 = require("zod");
const apiClient_js_1 = require("../apiClient.js");
const inputSchema = {
    player1_document: zod_1.z
        .string()
        .min(1)
        .describe("Cédula o pasaporte del primer jugador (campo 'cedula_passport' de la tabla personas)."),
    player2_document: zod_1.z
        .string()
        .min(1)
        .describe("Cédula o pasaporte del segundo jugador."),
    reason: zod_1.z
        .string()
        .optional()
        .describe("Justificación textual del por qué se hace este emparejamiento. Se persiste en el audit log."),
};
exports.pairPlayersTool = {
    name: "pair_players",
    description: [
        "Empareja dos jugadores asignándoles un team_code nuevo y único (formato AL<6 dígitos>).",
        "Reglas:",
        "- Ambos deben existir en personas con id_tipo=1 (jugadores).",
        "- Si cualquiera está en un foursome activo, el API rechaza con 409 y devuelve blocking_foursome.",
        "- Si alguno ya tenía pareja previa, esa pareja queda automáticamente desemparejada (orphan) y registrada en side_effects del audit log.",
        "- Si los dos ya están en el mismo team, la respuesta es idempotente (already_paired=true, no se crea audit row).",
        "Toda escritura queda en pair_audit_log con identidad del staff y es revertible vía revert_pair_audit.",
    ].join("\n"),
    inputSchema,
    handler: async (args, ctx) => (0, apiClient_js_1.apiCall)({
        method: "POST",
        path: "/api/person/pair",
        body: args,
        token: ctx.token,
    }),
};
//# sourceMappingURL=pairPlayers.js.map