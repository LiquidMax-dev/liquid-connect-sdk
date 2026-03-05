import type { VersionedTransaction, Transaction } from "@liquid/sdk-types";
import { getProvider } from "./getProvider";

/**
 * Signs a transaction using the Liquid provider without sending it.
 * @param transaction The transaction to sign (Web3.js format).
 * @returns A promise that resolves with the signed transaction.
 * @throws Error if Liquid provider is not found or if the operation fails.
 */
export async function signTransaction(
  transaction: VersionedTransaction | Transaction,
): Promise<VersionedTransaction | Transaction> {
  const provider = await getProvider();

  if (!provider.isConnected) {
    await provider.connect({ onlyIfTrusted: false });
  }

  return provider.signTransaction(transaction);
}
