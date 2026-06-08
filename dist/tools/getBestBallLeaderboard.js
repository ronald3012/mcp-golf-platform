"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBestBallLeaderboardTool = void 0;
const zod_1 = require("zod");
const apiClient_js_1 = require("../apiClient.js");
const inputSchema = {
    categoria: zod_1.z
        .number()
        .int()
        .describe("Categoría a filtrar."),
    fecha: zod_1.z.string().optional().describe("Fecha YYYY-MM-DD."),
    buscar: zod_1.z.string().optional().describe("Búsqueda parcial por nombre/jugador."),
    limit: zod_1.z.number().int().positive().max(500).optional(),
};
exports.getBestBallLeaderboardTool = {
    name: "get_best_ball_leaderboard",
    description: "Leaderboard en modo Best Ball (modo alternativo, no es el principal del torneo). Útil si el torneo usa best-ball en algún día específico o se necesita comparar contra el ranking scramble.",
    inputSchema,
    handler: async (args, ctx) => (0, apiClient_js_1.apiCall)({
        path: "/api/posteo/resultados",
        query: args,
        token: ctx.token,
    }),
};
//# sourceMappingURL=getBestBallLeaderboard.js.map