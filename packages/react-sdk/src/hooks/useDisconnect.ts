import { useCallback, useState } from "react";
import { useLiquid } from "../LiquidContext";

export function useDisconnect() {
  const { sdk } = useLiquid();
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const disconnect = useCallback(async () => {
    if (!sdk) {
      throw new Error("SDK not initialized");
    }

    setIsDisconnecting(true);
    setError(null);

    try {
      await sdk.disconnect();
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      throw err;
    } finally {
      setIsDisconnecting(false);
    }
  }, [sdk]);

  return {
    disconnect,
    isDisconnecting,
    error,
  };
}
