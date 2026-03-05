import type { EmbeddedProviderAuthType } from "../types";
import type { Algorithm } from "@liquid/sdk-types";

export interface AuthResult {
  walletId: string;
  organizationId: string; // Organization ID returned from auth flow
  provider: EmbeddedProviderAuthType;
  accountDerivationIndex: number; // Account derivation index from auth response
  expiresInMs: number; // Authenticator expiration time from auth response (for user-wallets)
  authUserId?: string; // User ID returned from auth flow (optional, for user-wallets)
  bearerToken?: string; // "${tokenType} ${accessToken}" for Authorization header
}

export interface LiquidConnectOptions {
  publicKey: string;
  appId: string;
  provider: EmbeddedProviderAuthType;
  redirectUrl?: string;
  authUrl?: string;
  sessionId: string;
  // OAuth session management parameters
  clearPreviousSession?: boolean; // Whether to clear previous OAuth session (default: false)
  allowRefresh?: boolean; // Whether to allow OAuth session refresh (default: true)
  algorithm?: Algorithm;
}

export interface AuthProvider {
  authenticate(options: LiquidConnectOptions): Promise<void | AuthResult>;
  resumeAuthFromRedirect?(provider: EmbeddedProviderAuthType): Promise<AuthResult | null>;
}

export interface LiquidAppAuthOptions {
  publicKey: string;
  appId: string;
  sessionId: string;
}

export interface LiquidAppProvider {
  authenticate(options: LiquidAppAuthOptions): Promise<AuthResult>;
  isAvailable(): boolean;
}
