import { useLiquid } from "../LiquidContext";
import type { ISolanaChain } from "@liquid/chain-interfaces";

/**
 * Hook for Solana chain operations in React Native
 *
 * @returns Solana chain interface with connection enforcement
 */
export function useSolana(): {
  solana: ISolanaChain;
  isAvailable: boolean;
} {
  const { sdk, isConnected } = useLiquid();

  return {
    solana: sdk.solana,
    isAvailable: !!isConnected,
  };
}
