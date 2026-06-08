import { z } from "zod";
import { apiCall } from "../apiClient.js";
import type { ToolDefinition } from "./types.js";

const inputSchema = {
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(200).optional(),
};

export const listFoursomesTool: ToolDefinition<typeof inputSchema> = {
  name: "list_foursomes",
  description:
    "Lista los foursomes existentes (cada uno con sus 4 jugadores, fecha, hora, tee, categorías, status). Paginado. Útil para que el AI vea la configuración actual del torneo antes de decidir reorganizar.",
  inputSchema,
  handler: async (args, ctx) =>
    apiCall({
      path: "/api/foursome/list",
      query: args,
      token: ctx.token,
    }),
};
