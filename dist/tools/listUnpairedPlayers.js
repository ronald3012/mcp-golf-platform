"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUnpairedPlayersTool = void 0;
const zod_1 = require("zod");
const apiClient_js_1 = require("../apiClient.js");
const inputSchema = {
    page: zod_1.z.number().int().positive().optional().describe("Página (default 1)."),
    limit: zod_1.z
        .number()
        .int()
        .positive()
        .max(200)
        .optional()
        .describe("Tamaño de página (default 40, máx 200)."),
    buscar: zod_1.z
        .string()
        .optional()
        .describe("Búsqueda parcial por firstname, lastname o cédula."),
};
exports.listUnpairedPlayersTool = {
    name: "list_unpaired_players",
    description: "Lista jugadores (id_tipo=1) sin pareja (team IS NULL). Paginado, con búsqueda opcional por nombre o cédula. Útil para identificar a quién emparejar.",
    inputSchema,
    handler: async (args, ctx) => (0, apiClient_js_1.apiCall)({
        path: "/api/person/unpaired",
        query: args,
        token: ctx.token,
    }),
};
//# sourceMappingURL=listUnpairedPlayers.js.map