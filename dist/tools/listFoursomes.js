"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listFoursomesTool = void 0;
const zod_1 = require("zod");
const apiClient_js_1 = require("../apiClient.js");
const inputSchema = {
    page: zod_1.z.number().int().positive().optional(),
    limit: zod_1.z.number().int().positive().max(200).optional(),
};
exports.listFoursomesTool = {
    name: "list_foursomes",
    description: "Lista los foursomes existentes (cada uno con sus 4 jugadores, fecha, hora, tee, categorías, status). Paginado. Útil para que el AI vea la configuración actual del torneo antes de decidir reorganizar.",
    inputSchema,
    handler: async (args, ctx) => (0, apiClient_js_1.apiCall)({
        path: "/api/foursome/list",
        query: args,
        token: ctx.token,
    }),
};
//# sourceMappingURL=listFoursomes.js.map