import { z } from "zod";
import { apiCall } from "../apiClient.js";
import type { ToolDefinition } from "./types.js";

const inputSchema = {
  id: z.number().int().positive().describe("ID del foursome a eliminar."),
  confirm: z
    .boolean()
    .optional()
    .describe(
      "Set en true SOLO si el humano ya confirmó que está OK perder los posteos asociados. " +
        "Por defecto omitir (no pasarlo). Si el foursome tiene posteos y este flag no es true, el API responde 409 con requires_confirmation:true y la cantidad de posteos que se perderían — en ese caso mostrá la advertencia al humano y pediś confirmación antes de re-llamar con confirm:true."
    ),
};

export const deleteFoursomeTool: ToolDefinition<typeof inputSchema> = {
  name: "delete_foursome",
  description: [
    "Elimina un foursome.",
    "Flujo importante de confirmación:",
    "1. Llamá PRIMERO sin confirm (o con confirm:false). Si el foursome NO tiene posteos, se elimina directo y respondé al usuario.",
    "2. Si el foursome SÍ tiene posteos, el API responde 409 con {requires_confirmation:true, posteos_count:N}. NO hagas re-try automático: mostrale al humano que esa eliminación borrará N posteos y preguntá si quiere proceder.",
    "3. Solo si el humano confirma explícitamente, volvé a llamar con confirm:true.",
    "Side effect: si se confirma con posteos, esos posteos se borran irreversiblemente.",
  ].join("\n"),
  inputSchema,
  handler: async (args, ctx) =>
    apiCall({
      method: "DELETE",
      path: `/api/foursome/${args.id}`,
      query: args.confirm ? { confirm: "true" } : undefined,
      token: ctx.token,
    }),
};
