import { useLiquid } from "../LiquidContext";

export function useAccounts() {
  const { addresses, isConnected } = useLiquid();

  // Return addresses only when connected
  return isConnected ? addresses : null;
}
