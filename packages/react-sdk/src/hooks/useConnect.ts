import { useCallback } from "react";
import { useLiquid } from "../LiquidContext";
import type { AuthOptions } from "@liquid/browser-sdk";

export function useConnect() {
  const { sdk, isConnecting, isLoading, errors } = useLiquid();

  const connect = useCallback(
    async (options: AuthOptions) => {
      if (!sdk) {
        throw new Error("SDK not initialized");
      }

      // Note: isConnecting state is now managed by connect_start/connect_error events in Provider
      // This ensures consistency between manual connect and autoConnect with zero race conditions
      try {
        const result = await sdk.connect(options);
        return result;
      } catch (err) {
        console.error("Error connecting to Liquid:", err);
        // Error handling is also managed by the connect_error event listener in Provider
        throw err;
      }
    },
    [sdk],
  );

  return {
    connect,
    isConnecting,
    isLoading,
    error: errors.connect,
  };
}
