import { InjectedEthereumStrategy } from "./strategies/injected";
import type { EthereumStrategy } from "./strategies/types";
import { ProviderStrategy } from "../types";

/**
 * Retrieves Liquid Ethereum provider and returns it if it exists.
 * @returns Liquid Ethereum provider or throws error if it doesn't exist.
 */
export async function getProvider(strategy: ProviderStrategy = ProviderStrategy.INJECTED): Promise<EthereumStrategy> {
  if (strategy === "injected") {
    const provider = new InjectedEthereumStrategy();
    await provider.load();
    return provider;
  } else {
    throw new Error("Invalid provider type.");
  }
}
