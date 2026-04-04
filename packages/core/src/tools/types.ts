export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
  execute(args: Record<string, unknown>): Promise<ToolResult>;
}

export interface ToolResult {
  success: boolean;
  output: string;
  error?: string;
}
