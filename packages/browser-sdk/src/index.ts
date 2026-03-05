// Main SDK
export { BrowserSDK } from "./BrowserSDK";

// Chain interfaces (from shared package)
export type { ISolanaChain, IEthereumChain, EthTransactionRequest } from "@liquid/chain-interfaces";

// Types
export * from "./types";

// Debug system
export { debug, DebugLevel, DebugCategory } from "./debug";
export type { DebugMessage, DebugCallback } from "./debug";

// Utility functions
export {
  detectBrowser,
  parseBrowserFromUserAgent,
  getPlatformName,
  getBrowserDisplayName,
  isMobileDevice,
} from "./utils/browser-detection";
export type { BrowserInfo } from "./utils/browser-detection";

export { getDeeplinkToLiquid } from "./utils/deeplink";

// Extension detection
export { waitForLiquidExtension } from "./waitForLiquidExtension";
export { isLiquidLoginAvailable } from "./isLiquidLoginAvailable";

// Re-export useful types from constants and client
export { NetworkId } from "@liquid/constants";
export { AddressType } from "@liquid/client";

// Re-export auto-confirm types
export type {
  AutoConfirmEnableParams,
  AutoConfirmResult,
  AutoConfirmSupportedChainsResult,
} from "@liquid/browser-injected-sdk/auto-confirm";

// Re-export event types for typed event handlers
export type {
  EmbeddedProviderEvent,
  ConnectEventData,
  ConnectStartEventData,
  ConnectErrorEventData,
  DisconnectEventData,
  EmbeddedProviderEventMap,
  EventCallback,
} from "@liquid/embedded-provider-core";

export { LIQUID_ICON } from "@liquid/constants";
export type { InjectedWalletInfo, InjectedWalletId } from "./wallets/registry";
