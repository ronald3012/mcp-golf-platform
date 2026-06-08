"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFoursomeTool = void 0;
const zod_1 = require("zod");
const apiClient_js_1 = require("../apiClient.js");
const inputSchema = {
    fecha: zod_1.z.string().describe("Fecha del foursome en formato YYYY-MM-DD."),
    hora: zod_1.z.string().describe("Hora en formato HH:MM o HH:MM:SS."),
    salida: zod_1.z
        .number()
        .int()
        .describe("Número de salida (orden de tee-off, normalmente 1-N)."),
    player1: zod_1.z.string().describe("Cédula/pasaporte del primer jugador (pareja 1)."),
    player2: zod_1.z.string().describe("Cédula/pasaporte del segundo jugador (pareja 1)."),
    player3: zod_1.z.string().describe("Cédula/pasaporte del tercer jugador (pareja 2)."),
    player4: zod_1.z.string().describe("Cédula/pasaporte del cuarto jugador (pareja 2)."),
    categoria1: zod_1.z.number().int().describe("Categoría de la pareja 1."),
    categoria2: zod_1.z.number().int().describe("Categoría de la pareja 2."),
    tee_pareja1: zod_1.z.string().describe("ID del tee asignado a la pareja 1."),
    tee_pareja2: zod_1.z.string().describe("ID del tee asignado a la pareja 2."),
    tipo: zod_1.z.string().describe("Tipo de juego (ej. 'scramble')."),
    playing_handicap1: zod_1.z
        .number()
        .optional()
        .describe("Playing handicap de la pareja 1 (default 24 si se omite)."),
    playing_handicap2: zod_1.z
        .number()
        .optional()
        .describe("Playing handicap de la pareja 2 (default 24 si se omite)."),
};
exports.createFoursomeTool = {
    name: "create_foursome",
    description: [
        "Crea un nuevo foursome con 4 jugadores agrupados en 2 parejas (player1+player2 vs player3+player4).",
        "Side effect importante: el API actualiza personas.team de los 4 jugadores asignándoles 2 team_codes nuevos generados aleatoriamente (uno por pareja).",
        "Si alguno de los jugadores ya estaba en otro foursome activo o con otro team_code, su asignación previa será sobreescrita.",
        "Los campos tournament_id y golf_course_id se setean automáticamente del lado del API.",
    ].join("\n"),
    inputSchema,
    handler: async (args, ctx) => (0, apiClient_js_1.apiCall)({
        method: "POST",
        path: "/api/foursome",
        body: args,
        token: ctx.token,
    }),
};
//# sourceMappingURL=createFoursome.js.map