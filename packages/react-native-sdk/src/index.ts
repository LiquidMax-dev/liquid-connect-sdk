// Main provider and context
export { LiquidProvider } from "./LiquidProvider";
export { useLiquid } from "./LiquidContext";
export { useModal } from "./ModalContext";

// Individual hooks
export * from "./hooks";

// Types
export type {
  LiquidSDKConfig,
  LiquidDebugConfig,
  ConnectOptions,
  ConnectResult,
  WalletAddress,
  SignMessageParams,
  SignMessageResult,
  SignAndSendTransactionParams,
  SignedTransaction,
} from "./types";

// Event types for typed event handlers
export type {
  EmbeddedProviderEvent,
  ConnectEventData,
  ConnectStartEventData,
  ConnectErrorEventData,
  DisconnectEventData,
  EmbeddedProviderEventMap,
  EventCallback,
} from "@liquid/embedded-provider-core";

export { AddressType } from "@liquid/client";
export { NetworkId } from "@liquid/constants";

// Theme exports - re-export from UI package for convenience
export { darkTheme, lightTheme } from "@liquid/wallet-sdk-ui";
export type { LiquidTheme } from "@liquid/wallet-sdk-ui";
