import { z } from "zod";
import { apiCall } from "../apiClient.js";
import type { ToolDefinition } from "./types.js";

const inputSchema = {
  player: z
    .string()
    .min(1)
    .describe("Cédula/pasaporte del jugador."),
};

export const getPlayerResultsTool: ToolDefinition<typeof inputSchema> = {
  name: "get_player_results",
  description: [
    "Historial completo de scoring de un jugador: posteos hoyo por hoyo, totales acumulados, score neto, comparación vs par.",
    "Usalo cuando el AI necesite diagnosticar 'por qué Carlos aparece tan abajo en el ranking' o 'mostrame el detalle de scoring de Juan Pérez'.",
  ].join("\n"),
  inputSchema,
  handler: async (args, ctx) =>
    apiCall({
      path: "/api/posteo/resultados_player",
      query: { player: args.player },
      token: ctx.token,
    }),
};
