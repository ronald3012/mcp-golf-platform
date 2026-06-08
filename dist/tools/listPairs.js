"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPairsTool = void 0;
const zod_1 = require("zod");
const apiClient_js_1 = require("../apiClient.js");
const inputSchema = {
    page: zod_1.z.number().int().positive().optional(),
    limit: zod_1.z.number().int().positive().max(200).optional(),
};
exports.listPairsTool = {
    name: "list_pairs",
    description: "Lista las parejas/teams formados actualmente, agrupados por team_code con sus miembros. Paginado. Muestra si un team tiene 1 miembro (orphan) o 2 (pareja completa).",
    inputSchema,
    handler: async (args, ctx) => (0, apiClient_js_1.apiCall)({
        path: "/api/person/pairs",
        query: args,
        token: ctx.token,
    }),
};
//# sourceMappingURL=listPairs.js.map