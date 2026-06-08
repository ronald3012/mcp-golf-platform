"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoundProgressTool = void 0;
const zod_1 = require("zod");
const apiClient_js_1 = require("../apiClient.js");
const inputSchema = {
    foursome_id: zod_1.z
        .number()
        .int()
        .positive()
        .describe("ID del foursome."),
};
exports.getRoundProgressTool = {
    name: "get_round_progress",
    description: [
        "Resumen rápido del avance de un foursome: cuántos hoyos jugados, primer y último hoyo posteado, total de posteos, timestamp del último posteo, y status del foursome.",
        "Es el tool más liviano para preguntas tipo '¿cuánto avanzó el foursome 195?' sin traer todo el scoring detallado.",
    ].join("\n"),
    inputSchema,
    handler: async (args, ctx) => (0, apiClient_js_1.apiCall)({
        path: `/api/foursome/round-progress/${args.foursome_id}`,
        token: ctx.token,
    }),
};
//# sourceMappingURL=getRoundProgress.js.map