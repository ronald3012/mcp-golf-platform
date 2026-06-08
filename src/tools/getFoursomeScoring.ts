import { z } from "zod";
import { apiCall } from "../apiClient.js";
import type { ToolDefinition } from "./types.js";

const inputSchema = {
  foursome_id: z
    .number()
    .int()
    .positive()
    .describe("ID del foursome."),
};

export const getFoursomeScoringTool: ToolDefinition<typeof inputSchema> = {
  name: "get_foursome_scoring",
  description: [
    "Devuelve el scoring scramble agregado del foursome: las 2 parejas con sus scores netos, diferencia vs par del campo, fotos de los 4 jugadores, etc.",
    "Útil para responder '¿cómo va el foursome 195?' o 'mostrame el detalle del grupo donde está Juan Pérez'.",
    "Si necesitás ver el progreso (qué hoyo van, cuántos jugados), usá get_round_progress.",
  ].join("\n"),
  inputSchema,
  handler: async (args, ctx) =>
    apiCall({
      path: "/api/foursome/resultado_foursome",
      query: { foursome: args.foursome_id },
      token: ctx.token,
    }),
};
