"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFoursomeScoringTool = void 0;
const zod_1 = require("zod");
const apiClient_js_1 = require("../apiClient.js");
const inputSchema = {
    foursome_id: zod_1.z
        .number()
        .int()
        .positive()
        .describe("ID del foursome."),
};
exports.getFoursomeScoringTool = {
    name: "get_foursome_scoring",
    description: [
        "Devuelve el scoring scramble agregado del foursome: las 2 parejas con sus scores netos, diferencia vs par del campo, fotos de los 4 jugadores, etc.",
        "Útil para responder '¿cómo va el foursome 195?' o 'mostrame el detalle del grupo donde está Juan Pérez'.",
        "Si necesitás ver el progreso (qué hoyo van, cuántos jugados), usá get_round_progress.",
    ].join("\n"),
    inputSchema,
    handler: async (args, ctx) => (0, apiClient_js_1.apiCall)({
        path: "/api/foursome/resultado_foursome",
        query: { foursome: args.foursome_id },
        token: ctx.token,
    }),
};
//# sourceMappingURL=getFoursomeScoring.js.map