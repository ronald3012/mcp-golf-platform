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

export const getRoundProgressTool: ToolDefinition<typeof inputSchema> = {
  name: "get_round_progress",
  description: [
    "Resumen rápido del avance de un foursome: cuántos hoyos jugados, primer y último hoyo posteado, total de posteos, timestamp del último posteo, y status del foursome.",
    "Es el tool más liviano para preguntas tipo '¿cuánto avanzó el foursome 195?' sin traer todo el scoring detallado.",
  ].join("\n"),
  inputSchema,
  handler: async (args, ctx) =>
    apiCall({
      path: `/api/foursome/round-progress/${args.foursome_id}`,
      token: ctx.token,
    }),
};
