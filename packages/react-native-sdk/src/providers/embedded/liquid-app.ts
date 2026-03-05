import type { LiquidAppProvider, LiquidAppAuthOptions, AuthResult } from "@liquid/embedded-provider-core";

/**
 * React Native implementation of LiquidAppProvider.
 *
 * Note: React Native does not have access to browser extensions,
 * so this implementation always returns false for isAvailable()
 * and throws an error if authenticate() is called.
 *
 * In the future, this could be extended to support deep linking
 * to the Liquid mobile app.
 */
export class ReactNativeLiquidAppProvider implements LiquidAppProvider {
  isAvailable(): boolean {
    return false;
  }

  authenticate(_options: LiquidAppAuthOptions): Promise<AuthResult> {
    return Promise.reject(
      new Error(
        "Liquid app authentication is not available in React Native. " +
          "Please use other authentication methods like Google, Apple, or JWT.",
      ),
    );
  }
}
