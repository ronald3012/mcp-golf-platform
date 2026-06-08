import { z } from "zod";
import { apiCall } from "../apiClient.js";
import type { ToolDefinition } from "./types.js";

const inputSchema = {
  audit_id: z
    .number()
    .int()
    .positive()
    .describe("ID del audit log a revertir (obtenido de list_pair_audit o de la respuesta de pair/unpair)."),
  reason: z
    .string()
    .optional()
    .describe("Justificación del revert."),
};

export const revertPairAuditTool: ToolDefinition<typeof inputSchema> = {
  name: "revert_pair_audit",
  description: [
    "Deshace una operación previa (pair o unpair) por su ID de audit.",
    "Reglas:",
    "- 404 si el audit_id no existe.",
    "- 409 si el audit ya fue revertido previamente (no se permite doble revert).",
    "- 409 si el audit original es ya un revert (no se revierten reverts; re-aplicar la operación original).",
    "- 409 si algún jugador involucrado está ahora en un foursome activo.",
    "Restaura el estado anterior, incluyendo los orphans registrados en side_effects.",
  ].join("\n"),
  inputSchema,
  handler: async (args, ctx) =>
    apiCall({
      method: "POST",
      path: `/api/person/pair-audit/${args.audit_id}/revert`,
      body: args.reason ? { reason: args.reason } : undefined,
      token: ctx.token,
    }),
};
