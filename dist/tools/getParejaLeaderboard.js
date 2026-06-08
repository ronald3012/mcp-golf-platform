"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getParejaLeaderboardTool = void 0;
const zod_1 = require("zod");
const apiClient_js_1 = require("../apiClient.js");
const inputSchema = {
    categoria: zod_1.z.number().int().describe("Categoría a filtrar."),
    fecha: zod_1.z
        .string()
        .describe("Fecha YYYY-MM-DD del día del torneo a consultar."),
    mode: zod_1.z
        .enum(["scramble", "best_ball"])
        .default("scramble")
        .describe("Modo de juego. 'scramble' es el modo principal del torneo iQtek."),
};
exports.getParejaLeaderboardTool = {
    name: "get_pareja_leaderboard",
    description: [
        "Ranking por pareja (no por jugador individual): cada entrada es una pareja con sus 2 miembros, fotos, score acumulado del equipo y diferencia vs par.",
        "Útil cuando el AI quiere mostrar 'top 5 parejas hoy en categoría 1' con todo el contexto visual.",
        "Incluye resultados del foursome scramble si es modo scramble.",
    ].join("\n"),
    inputSchema,
    handler: async (args, ctx) => {
        const path = args.mode === "best_ball"
            ? "/api/posteo/resultados_pareja2"
            // path montado como "posteo_scrambla" (typo histórico en index.js del API)
            : "/api/posteo_scrambla/resultados_pareja2";
        return (0, apiClient_js_1.apiCall)({
            path,
            query: { categoria: args.categoria, fecha: args.fecha },
            token: ctx.token,
        });
    },
};
//# sourceMappingURL=getParejaLeaderboard.js.map