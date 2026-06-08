"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPlayerResultsTool = void 0;
const zod_1 = require("zod");
const apiClient_js_1 = require("../apiClient.js");
const inputSchema = {
    player: zod_1.z
        .string()
        .min(1)
        .describe("Cédula/pasaporte del jugador."),
};
exports.getPlayerResultsTool = {
    name: "get_player_results",
    description: [
        "Historial completo de scoring de un jugador: posteos hoyo por hoyo, totales acumulados, score neto, comparación vs par.",
        "Usalo cuando el AI necesite diagnosticar 'por qué Carlos aparece tan abajo en el ranking' o 'mostrame el detalle de scoring de Juan Pérez'.",
    ].join("\n"),
    inputSchema,
    handler: async (args, ctx) => (0, apiClient_js_1.apiCall)({
        path: "/api/posteo/resultados_player",
        query: { player: args.player },
        token: ctx.token,
    }),
};
//# sourceMappingURL=getPlayerResults.js.map