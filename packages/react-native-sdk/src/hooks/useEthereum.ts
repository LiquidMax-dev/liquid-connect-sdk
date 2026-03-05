import { useLiquid } from "../LiquidContext";
import type { IEthereumChain } from "@liquid/chain-interfaces";

/**
 * Hook for Ethereum chain operations in React Native
 *
 * @returns Ethereum chain interface with connection enforcement
 */
export function useEthereum(): {
  ethereum: IEthereumChain;
  isAvailable: boolean;
} {
  const { sdk, isConnected } = useLiquid();

  return {
    // Chain instance with connection enforcement for signing methods
    ethereum: sdk.ethereum,
    // State
    isAvailable: !!isConnected,
  };
}
