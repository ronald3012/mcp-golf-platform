import type { z } from "zod";

export interface ToolContext {
  token: string;
}

export interface ToolDefinition<TInput extends z.ZodRawShape> {
  name: string;
  description: string;
  inputSchema: TInput;
  handler: (
    args: z.infer<z.ZodObject<TInput>>,
    ctx: ToolContext
  ) => Promise<unknown>;
}
