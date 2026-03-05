import * as React from "react";
import { isLiquidLoginAvailable } from "@liquid/browser-sdk";

/**
 * React hook to check if Liquid Login is available
 * Checks if extension is installed and supports liquid_login feature
 */
export function useIsLiquidLoginAvailable() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [isAvailable, setIsAvailable] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    const checkLiquidLogin = async () => {
      try {
        setIsLoading(true);
        const result = await isLiquidLoginAvailable(3000);
        if (isMounted) {
          setIsAvailable(result);
        }
      } catch (error) {
        // If check fails, assume not available
        if (isMounted) {
          setIsAvailable(false);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkLiquidLogin();

    return () => {
      isMounted = false;
    };
  }, []);

  return { isLoading, isAvailable };
}
