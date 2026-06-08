import { z } from "zod";
import { apiCall } from "../apiClient.js";
import type { ToolDefinition } from "./types.js";

const inputSchema = {
  page: z.number().int().positive().optional().describe("Página (default 1)."),
  limit: z
    .number()
    .int()
    .positive()
    .max(200)
    .optional()
    .describe("Tamaño de página (default 40, máx 200)."),
  buscar: z
    .string()
    .optional()
    .describe("Búsqueda parcial por firstname, lastname o cédula."),
};

export const listUnpairedPlayersTool: ToolDefinition<typeof inputSchema> = {
  name: "list_unpaired_players",
  description:
    "Lista jugadores (id_tipo=1) sin pareja (team IS NULL). Paginado, con búsqueda opcional por nombre o cédula. Útil para identificar a quién emparejar.",
  inputSchema,
  handler: async (args, ctx) =>
    apiCall({
      path: "/api/person/unpaired",
      query: args,
      token: ctx.token,
    }),
};
