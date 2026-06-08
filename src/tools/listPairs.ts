import { z } from "zod";
import { apiCall } from "../apiClient.js";
import type { ToolDefinition } from "./types.js";

const inputSchema = {
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(200).optional(),
};

export const listPairsTool: ToolDefinition<typeof inputSchema> = {
  name: "list_pairs",
  description:
    "Lista las parejas/teams formados actualmente, agrupados por team_code con sus miembros. Paginado. Muestra si un team tiene 1 miembro (orphan) o 2 (pareja completa).",
  inputSchema,
  handler: async (args, ctx) =>
    apiCall({
      path: "/api/person/pairs",
      query: args,
      token: ctx.token,
    }),
};
