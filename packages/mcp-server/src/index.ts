// Library entry point — re-exports public API only.
// For the CLI / MCP server entry point see cli.ts.

// Export SessionManager and types for external usage
export { SessionManager } from "./session/manager.js";
export type { SessionData } from "./session/types.js";

// Export tools for external usage
export { tools } from "./tools/index.js";
export type { ToolHandler, ToolContext } from "./tools/types.js";

// Re-export LiquidClient type for convenience
export type { LiquidClient } from "@liquid/client";
