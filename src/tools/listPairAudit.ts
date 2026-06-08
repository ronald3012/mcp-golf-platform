import { z } from "zod";
import { apiCall } from "../apiClient.js";
import type { ToolDefinition } from "./types.js";

const inputSchema = {
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(200).optional(),
  actor_uid: z
    .string()
    .optional()
    .describe("Filtrar por staff uid que disparó la operación."),
  player_doc: z
    .string()
    .optional()
    .describe("Filtrar por cédula de un jugador involucrado."),
  from: z
    .string()
    .optional()
    .describe("Fecha desde (formato YYYY-MM-DD o ISO 8601)."),
  to: z.string().optional().describe("Fecha hasta."),
};

export const listPairAuditTool: ToolDefinition<typeof inputSchema> = {
  name: "list_pair_audit",
  description:
    "Lista el historial completo de operaciones de pair/unpair/revert. Cada row incluye actor, action, before/after, side_effects y reverted_by_audit_id. Útil para investigar quién hizo qué y para encontrar audit_ids a revertir.",
  inputSchema,
  handler: async (args, ctx) =>
    apiCall({
      path: "/api/person/pair-audit",
      query: args,
      token: ctx.token,
    }),
};
