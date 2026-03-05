import { useLiquid } from "../LiquidContext";

export function useAccounts() {
  const { addresses, isConnected, walletId } = useLiquid();

  return {
    addresses,
    isConnected,
    walletId,
  };
}
