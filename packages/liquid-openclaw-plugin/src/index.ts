/**
 * Liquid OpenClaw Plugin
 *
 * Integrates Liquid wallet operations directly with OpenClaw agents
 * by wrapping the Liquid MCP Server tools.
 */

import type { OpenClawApi } from "./client/types.js";
import { PluginSession } from "./session.js";
import { registerLiquidTools } from "./tools/register-tools.js";

// Singleton session instance
let sessionInstance: PluginSession | null = null;
const PLUGIN_ID = "liquid-openclaw-plugin";

const STRING_CONFIG_KEYS = [
  "LIQUID_APP_ID",
  "LIQUID_CLIENT_ID",
  "LIQUID_CLIENT_SECRET",
  "LIQUID_AUTH_BASE_URL",
  "LIQUID_CONNECT_BASE_URL",
  "LIQUID_API_BASE_URL",
  "LIQUID_CALLBACK_PATH",
  "LIQUID_SSO_PROVIDER",
  "LIQUID_MCP_DEBUG",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * OpenClaw passes the full openclaw.json object as api.config.
 * Extract this plugin's scoped config when available.
 */
function getPluginConfig(fullConfig?: Record<string, unknown>): Record<string, unknown> | undefined {
  if (!fullConfig) {
    return undefined;
  }

  const plugins = fullConfig.plugins;
  if (!isRecord(plugins)) {
    return fullConfig;
  }

  const entries = plugins.entries;
  if (!isRecord(entries)) {
    return fullConfig;
  }

  const pluginEntry = entries[PLUGIN_ID];
  if (!isRecord(pluginEntry)) {
    return fullConfig;
  }

  const pluginConfig = pluginEntry.config;
  if (isRecord(pluginConfig)) {
    return pluginConfig;
  }

  return fullConfig;
}

function applyConfigToEnv(config?: Record<string, unknown>): void {
  if (!config) {
    return;
  }

  for (const key of STRING_CONFIG_KEYS) {
    const value = config[key];
    if (typeof value === "string" && value.trim().length > 0) {
      process.env[key] = value.trim();
    }
  }

  const rawPort = config.LIQUID_CALLBACK_PORT;
  let parsedPort: number | null = null;

  if (typeof rawPort === "number") {
    parsedPort = rawPort;
  } else if (typeof rawPort === "string") {
    const parsed = Number.parseInt(rawPort, 10);
    parsedPort = Number.isNaN(parsed) ? null : parsed;
  }

  if (parsedPort !== null && Number.isInteger(parsedPort) && parsedPort > 0 && parsedPort <= 65535) {
    process.env.LIQUID_CALLBACK_PORT = String(parsedPort);
  }
}

/**
 * Get or create the plugin session with configuration
 */
function getSession(config?: Record<string, unknown>): PluginSession {
  if (!sessionInstance) {
    const pluginConfig = getPluginConfig(config);
    applyConfigToEnv(pluginConfig);

    const appId = (process.env.LIQUID_APP_ID ?? process.env.LIQUID_CLIENT_ID)?.trim();
    if (!appId) {
      throw new Error(
        'LIQUID_APP_ID is required. Configure it in "~/.openclaw/openclaw.json" at plugins.entries["liquid-openclaw-plugin"].config.LIQUID_APP_ID',
      );
    }

    const envPort = process.env.LIQUID_CALLBACK_PORT?.trim();
    const parsedPort = envPort ? Number.parseInt(envPort, 10) : NaN;
    const callbackPort = Number.isInteger(parsedPort) && parsedPort > 0 && parsedPort <= 65535 ? parsedPort : undefined;

    sessionInstance = new PluginSession({
      appId,
      callbackPort,
    });
  }
  return sessionInstance;
}

/**
 * Reset the session singleton (used for cleanup on initialization failure)
 */
function resetSession(): void {
  sessionInstance = null;
}

/**
 * Plugin registration function
 */
export default async function register(api: OpenClawApi) {
  try {
    // Initialize session (authenticate if needed)
    const session = getSession(api.config);
    await session.initialize();

    // Register all Liquid MCP tools
    registerLiquidTools(api, session);
  } catch (error) {
    console.error("Failed to initialize Liquid OpenClaw plugin:", error); // eslint-disable-line no-console
    // Reset singleton so next attempt gets a fresh instance
    resetSession();
    throw error;
  }
}
