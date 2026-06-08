import { z } from "zod";
import { apiCall } from "../apiClient.js";
import type { ToolDefinition } from "./types.js";

const inputSchema = {
  categoria: z
    .number()
    .int()
    .describe("Categoría a filtrar."),
  fecha: z.string().optional().describe("Fecha YYYY-MM-DD."),
  buscar: z.string().optional().describe("Búsqueda parcial por nombre/jugador."),
  limit: z.number().int().positive().max(500).optional(),
};

export const getBestBallLeaderboardTool: ToolDefinition<typeof inputSchema> = {
  name: "get_best_ball_leaderboard",
  description:
    "Leaderboard en modo Best Ball (modo alternativo, no es el principal del torneo). Útil si el torneo usa best-ball en algún día específico o se necesita comparar contra el ranking scramble.",
  inputSchema,
  handler: async (args, ctx) =>
    apiCall({
      path: "/api/posteo/resultados",
      query: args,
      token: ctx.token,
    }),
};
