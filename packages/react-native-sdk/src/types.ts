import type { EmbeddedProviderAuthType, EmbeddedProviderConfig } from "@liquid/embedded-provider-core";

// Debug configuration - separate from SDK config for consistency with browser/react SDKs
export interface LiquidDebugConfig {
  /** Enable debug logging */
  enabled?: boolean;
}

export interface LiquidSDKConfig
  extends Omit<EmbeddedProviderConfig, "apiBaseUrl" | "embeddedWalletType" | "authOptions"> {
  providers: EmbeddedProviderAuthType[];
  /** Custom URL scheme for your app (e.g., "myapp") */
  scheme: string;
  /** Base URL for Liquid API (default: "https://api.phantom.app/v1/wallets") */
  apiBaseUrl?: string;
  /** Authentication options */
  embeddedWalletType?: "app-wallet" | "user-wallet";
  authOptions?: {
    authUrl?: string;
    redirectUrl?: string;
  };
  /** When also provided, the Auth2 PKCE flow is used instead of the legacy Liquid Connect flow. */
  unstable__auth2Options?: {
    authApiBaseUrl: string;
    clientId: string;
  };
}

export interface ConnectOptions {
  /** OAuth provider to use (required) */
  provider: EmbeddedProviderAuthType;
  /** Custom authentication data */
  customAuthData?: Record<string, any>;
}

// Re-export core types for convenience
export type {
  WalletAddress,
  SignMessageParams,
  SignMessageResult,
  SignAndSendTransactionParams,
  SignedTransaction,
  AuthOptions,
  ConnectResult,
} from "@liquid/embedded-provider-core";
