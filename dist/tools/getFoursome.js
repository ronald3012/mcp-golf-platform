"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFoursomeTool = void 0;
const zod_1 = require("zod");
const apiClient_js_1 = require("../apiClient.js");
const inputSchema = {
    id: zod_1.z
        .number()
        .int()
        .positive()
        .describe("ID del foursome a consultar."),
};
exports.getFoursomeTool = {
    name: "get_foursome",
    description: "Obtiene los detalles completos de un foursome por su ID: 4 jugadores, fecha, hora, salida, tees, categorías, handicaps, status, confirmaciones de pareja.",
    inputSchema,
    handler: async (args, ctx) => (0, apiClient_js_1.apiCall)({
        path: `/api/foursome/${args.id}`,
        token: ctx.token,
    }),
};
//# sourceMappingURL=getFoursome.js.map