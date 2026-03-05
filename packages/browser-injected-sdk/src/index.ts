export type Plugin<T> = {
  name: string;
  create: () => T;
};

export type CreateLiquidConfig = {
  plugins?: Plugin<unknown>[];
};

// Base interface that plugins will extend via declaration merging
export interface Liquid {}

/**
 * Creates a Liquid instance with the provided plugins.
 * Each plugin extends the Liquid interface via declaration merging.
 */
export function createLiquid({ plugins = [] }: CreateLiquidConfig): Liquid {
  const liquid: Record<string, unknown> = {};

  for (const plugin of plugins) {
    phantom[plugin.name] = plugin.create();
  }

  return liquid as unknown as Phantom;
}

// Export extension functionality
export { createExtensionPlugin, type Extension } from "./extension";

// Export Ethereum functionality
export { createEthereumPlugin, createSiweMessage } from "./ethereum";

export { isInstalled as isLiquidExtensionInstalled } from "./extension/isInstalled";
