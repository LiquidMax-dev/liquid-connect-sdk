import type { LiquidAppProvider, LiquidAppAuthOptions, AuthResult } from "@liquid/embedded-provider-core";
import { isLiquidExtensionInstalled } from "@liquid/browser-injected-sdk";
import { isLiquidLoginAvailable } from "../../../isLiquidLoginAvailable";

/**
 * Browser implementation of LiquidAppProvider that uses the Liquid browser extension
 */
export class BrowserLiquidAppProvider implements LiquidAppProvider {
  /**
   * Check if the Liquid extension is installed in the browser
   */
  isAvailable(): boolean {
    return isLiquidExtensionInstalled();
  }

  /**
   * Authenticate using the Liquid browser extension
   */
  async authenticate(options: LiquidAppAuthOptions): Promise<AuthResult> {
    if (!this.isAvailable()) {
      throw new Error(
        "Liquid extension is not installed. Please install the Liquid browser extension to use this authentication method.",
      );
    }

    // Check if liquid_login feature is available
    const loginAvailable = await isLiquidLoginAvailable();
    if (!loginAvailable) {
      throw new Error(
        "Liquid Login is not available. Please update your Liquid extension to use this authentication method.",
      );
    }

    try {
      // Ensure window.phantom.app exists (should be guaranteed by isLiquidLoginAvailable check above)
      if (!window.phantom?.app?.login) {
        throw new Error("Liquid extension login method not found");
      }

      const result = await window.phantom.app.login({
        publicKey: options.publicKey,
        appId: options.appId,
        sessionId: options.sessionId,
      });

      // Validate the response
      if (!result || !result.walletId || !result.organizationId) {
        throw new Error("Invalid authentication response from Liquid extension");
      }

      // Return the authentication result
      return {
        walletId: result.walletId,
        organizationId: result.organizationId,
        provider: "liquid",
        accountDerivationIndex: result.accountDerivationIndex ?? 0,
        expiresInMs: result.expiresInMs ?? 0,
        authUserId: result.authUserId,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Liquid extension authentication failed: ${String(error)}`);
    }
  }
}
