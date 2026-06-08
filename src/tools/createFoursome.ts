import { z } from "zod";
import { apiCall } from "../apiClient.js";
import type { ToolDefinition } from "./types.js";

const inputSchema = {
  fecha: z.string().describe("Fecha del foursome en formato YYYY-MM-DD."),
  hora: z.string().describe("Hora en formato HH:MM o HH:MM:SS."),
  salida: z
    .number()
    .int()
    .describe("Número de salida (orden de tee-off, normalmente 1-N)."),
  player1: z.string().describe("Cédula/pasaporte del primer jugador (pareja 1)."),
  player2: z.string().describe("Cédula/pasaporte del segundo jugador (pareja 1)."),
  player3: z.string().describe("Cédula/pasaporte del tercer jugador (pareja 2)."),
  player4: z.string().describe("Cédula/pasaporte del cuarto jugador (pareja 2)."),
  categoria1: z.number().int().describe("Categoría de la pareja 1."),
  categoria2: z.number().int().describe("Categoría de la pareja 2."),
  tee_pareja1: z.string().describe("ID del tee asignado a la pareja 1."),
  tee_pareja2: z.string().describe("ID del tee asignado a la pareja 2."),
  tipo: z.string().describe("Tipo de juego (ej. 'scramble')."),
  playing_handicap1: z
    .number()
    .optional()
    .describe("Playing handicap de la pareja 1 (default 24 si se omite)."),
  playing_handicap2: z
    .number()
    .optional()
    .describe("Playing handicap de la pareja 2 (default 24 si se omite)."),
};

export const createFoursomeTool: ToolDefinition<typeof inputSchema> = {
  name: "create_foursome",
  description: [
    "Crea un nuevo foursome con 4 jugadores agrupados en 2 parejas (player1+player2 vs player3+player4).",
    "Side effect importante: el API actualiza personas.team de los 4 jugadores asignándoles 2 team_codes nuevos generados aleatoriamente (uno por pareja).",
    "Si alguno de los jugadores ya estaba en otro foursome activo o con otro team_code, su asignación previa será sobreescrita.",
    "Los campos tournament_id y golf_course_id se setean automáticamente del lado del API.",
  ].join("\n"),
  inputSchema,
  handler: async (args, ctx) =>
    apiCall({
      method: "POST",
      path: "/api/foursome",
      body: args,
      token: ctx.token,
    }),
};
