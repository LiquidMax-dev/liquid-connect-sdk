import { createContext, useContext } from "react";
import type { EmbeddedProvider, ConnectResult, EmbeddedProviderAuthType } from "@liquid/embedded-provider-core";
import type { WalletAddress } from "./types";

export interface LiquidErrors {
  connect?: Error;
  spendingLimit?: boolean;
}

export interface LiquidContextValue {
  sdk: EmbeddedProvider;
  isConnected: boolean;
  isConnecting: boolean;
  errors: LiquidErrors;
  addresses: WalletAddress[];
  walletId: string | null;
  setWalletId: (walletId: string | null) => void;
  user: ConnectResult | null;
  allowedProviders: EmbeddedProviderAuthType[];
  clearError: (key: keyof LiquidErrors) => void;
}

export const LiquidContext = createContext<LiquidContextValue | undefined>(undefined);

export function useLiquid(): LiquidContextValue {
  const context = useContext(LiquidContext);
  if (context === undefined) {
    throw new Error("useLiquid must be used within a LiquidProvider");
  }
  return context;
}
