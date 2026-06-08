import { z } from "zod";
import { apiCall } from "../apiClient.js";
import type { ToolDefinition } from "./types.js";

const inputSchema = {
  id: z
    .number()
    .int()
    .positive()
    .describe("ID del foursome a consultar."),
};

export const getFoursomeTool: ToolDefinition<typeof inputSchema> = {
  name: "get_foursome",
  description:
    "Obtiene los detalles completos de un foursome por su ID: 4 jugadores, fecha, hora, salida, tees, categorías, handicaps, status, confirmaciones de pareja.",
  inputSchema,
  handler: async (args, ctx) =>
    apiCall({
      path: `/api/foursome/${args.id}`,
      token: ctx.token,
    }),
};
