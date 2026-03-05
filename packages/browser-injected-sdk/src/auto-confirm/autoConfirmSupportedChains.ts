import { getProvider } from "./getProvider";
import type { AutoConfirmSupportedChainsResult } from "./types";
import { internalCaipToNetworkId } from "@liquid/constants";

export async function autoConfirmSupportedChains(): Promise<AutoConfirmSupportedChainsResult> {
  const provider = getProvider();

  const result = await provider.request({
    method: "liquid_auto_confirm_supported_chains",
    params: {},
  });

  // Transform InternalNetworkCaip back to NetworkId for public interface
  return {
    chains: result.chains.map(internalCaipToNetworkId),
  };
}
