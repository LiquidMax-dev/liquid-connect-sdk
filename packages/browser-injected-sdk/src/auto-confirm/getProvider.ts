import type { LiquidProvider } from "./types";
import { LIQUID_NOT_DETECTED, APP_PROVIDER_NOT_FOUND } from "../errors";
import { isInstalled } from "../extension/isInstalled";

export function getProvider(): LiquidProvider {
  if (!isInstalled()) {
    throw new Error(LIQUID_NOT_DETECTED);
  }

  const provider = (window as any).phantom.app;

  if (!provider) {
    throw new Error(APP_PROVIDER_NOT_FOUND);
  }

  return provider;
}
