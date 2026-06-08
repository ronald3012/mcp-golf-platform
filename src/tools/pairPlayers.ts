import { z } from "zod";
import { apiCall } from "../apiClient.js";
import type { ToolDefinition } from "./types.js";

const inputSchema = {
  player1_document: z
    .string()
    .min(1)
    .describe("Cédula o pasaporte del primer jugador (campo 'cedula_passport' de la tabla personas)."),
  player2_document: z
    .string()
    .min(1)
    .describe("Cédula o pasaporte del segundo jugador."),
  reason: z
    .string()
    .optional()
    .describe(
      "Justificación textual del por qué se hace este emparejamiento. Se persiste en el audit log."
    ),
};

export const pairPlayersTool: ToolDefinition<typeof inputSchema> = {
  name: "pair_players",
  description: [
    "Empareja dos jugadores asignándoles un team_code nuevo y único (formato AL<6 dígitos>).",
    "Reglas:",
    "- Ambos deben existir en personas con id_tipo=1 (jugadores).",
    "- Si cualquiera está en un foursome activo, el API rechaza con 409 y devuelve blocking_foursome.",
    "- Si alguno ya tenía pareja previa, esa pareja queda automáticamente desemparejada (orphan) y registrada en side_effects del audit log.",
    "- Si los dos ya están en el mismo team, la respuesta es idempotente (already_paired=true, no se crea audit row).",
    "Toda escritura queda en pair_audit_log con identidad del staff y es revertible vía revert_pair_audit.",
  ].join("\n"),
  inputSchema,
  handler: async (args, ctx) =>
    apiCall({
      method: "POST",
      path: "/api/person/pair",
      body: args,
      token: ctx.token,
    }),
};
