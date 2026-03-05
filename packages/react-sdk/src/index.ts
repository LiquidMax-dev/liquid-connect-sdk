// Provider
export { LiquidProvider } from "./LiquidProvider";
export type { LiquidProviderProps, LiquidSDKConfig, LiquidDebugConfig, ConnectOptions } from "./LiquidProvider";

// Context
export { useLiquid } from "./LiquidContext";

// Hooks
export * from "./hooks";

// Components
export * from "./components";

// Theme - re-exported from @liquid/wallet-sdk-ui
export { darkTheme, lightTheme, mergeTheme } from "@liquid/wallet-sdk-ui";
export type { LiquidTheme, ComputedLiquidTheme, HexColor } from "@liquid/wallet-sdk-ui";

// Types
export * from "./types";

// Re-export useful types and utilities from browser-sdk
export { NetworkId, AddressType, DebugLevel, debug, isMobileDevice } from "@liquid/browser-sdk";

export type {
  EmbeddedProviderEvent,
  ConnectEventData,
  ConnectStartEventData,
  ConnectErrorEventData,
  DisconnectEventData,
  EmbeddedProviderEventMap,
  EventCallback,
  DebugMessage,
  AutoConfirmEnableParams,
  AutoConfirmResult,
  AutoConfirmSupportedChainsResult,
  AuthOptions,
  InjectedWalletInfo,
  InjectedWalletId,
} from "@liquid/browser-sdk";

// Re-export chain interfaces
export type { ISolanaChain, IEthereumChain, EthTransactionRequest } from "@liquid/chain-interfaces";
