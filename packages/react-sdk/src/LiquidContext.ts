import { createContext, useContext } from "react";
import type { BrowserSDK, WalletAddress, ConnectResult, AuthProviderType } from "@liquid/browser-sdk";
import type { LiquidTheme } from "@liquid/wallet-sdk-ui";

export interface LiquidErrors {
  connect?: Error;
  spendingLimit?: boolean;
}

export interface LiquidContextValue {
  sdk: BrowserSDK | null;
  isConnected: boolean;
  isConnecting: boolean;
  isLoading: boolean;
  errors: LiquidErrors;
  addresses: WalletAddress[];
  isClient: boolean;
  user: ConnectResult | null;
  theme: LiquidTheme;
  allowedProviders: AuthProviderType[];
  clearError: (key: keyof LiquidErrors) => void;
}

export const LiquidContext = createContext<LiquidContextValue | undefined>(undefined);

export function useLiquid() {
  const context = useContext(LiquidContext);
  if (!context) {
    throw new Error("useLiquid must be used within a LiquidProvider");
  }
  return context;
}
