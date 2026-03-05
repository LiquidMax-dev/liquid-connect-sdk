import { getProvider } from "./getProvider";
import type { AutoConfirmResult } from "./types";
import { internalCaipToNetworkId } from "@liquid/constants";

export async function autoConfirmDisable(): Promise<AutoConfirmResult> {
  const provider = getProvider();

  const result = await provider.request({
    method: "liquid_auto_confirm_disable",
    params: {},
  });

  // Transform InternalNetworkCaip back to NetworkId for public interface
  return {
    ...result,
    chains: result.chains.map(internalCaipToNetworkId),
  };
}
