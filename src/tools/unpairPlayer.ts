import { z } from "zod";
import { apiCall } from "../apiClient.js";
import type { ToolDefinition } from "./types.js";

const inputSchema = {
  document: z
    .string()
    .min(1)
    .describe("Cédula del jugador a desemparejar."),
  reason: z
    .string()
    .optional()
    .describe("Justificación del unpair. Se persiste en el audit log."),
};

export const unpairPlayerTool: ToolDefinition<typeof inputSchema> = {
  name: "unpair_player",
  description: [
    "Desempareja un jugador. Si tenía pareja, AMBOS quedan sin team_code.",
    "Reglas:",
    "- 404 si el jugador no existe.",
    "- 400 si el jugador no tiene team (nada que desemparejar).",
    "- 409 si el jugador está en un foursome activo.",
    "Operación revertible vía revert_pair_audit.",
  ].join("\n"),
  inputSchema,
  handler: async (args, ctx) =>
    apiCall({
      method: "POST",
      path: `/api/person/${encodeURIComponent(args.document)}/unpair`,
      body: args.reason ? { reason: args.reason } : undefined,
      token: ctx.token,
    }),
};
