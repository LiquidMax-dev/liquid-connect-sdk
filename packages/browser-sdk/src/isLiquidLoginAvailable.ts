import { waitForLiquidExtension } from "./waitForLiquidExtension";

/**
 * Check if Liquid Login is available
 *
 * This function checks if:
 * 1. The Liquid extension is installed
 * 2. The extension supports the liquid_login feature
 *
 * @param timeoutMs - Maximum time to wait for extension in milliseconds (default: 3000)
 * @returns Promise<boolean> - true if Liquid Login is available, false otherwise
 *
 * Usage:
 * ```typescript
 * const isAvailable = await isLiquidLoginAvailable();
 * ```
 */
export async function isLiquidLoginAvailable(timeoutMs: number = 3000): Promise<boolean> {
  // First, wait for the extension to be installed
  const extensionInstalled = await waitForLiquidExtension(timeoutMs);
  if (!extensionInstalled) {
    return false;
  }

  // Check if the features API is available and returns liquid_login
  try {
    if (!window.phantom?.app?.features || typeof window.phantom.app.features !== "function") {
      return false;
    }

    const response = await window.phantom.app.features();

    if (!Array.isArray(response.features)) {
      return false;
    }

    return response.features.includes("liquid_login");
  } catch (error) {
    console.error("Error checking Liquid extension features", error);
    // If the features call fails, liquid_login is not available
    return false;
  }
}
