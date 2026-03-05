import { createConfig } from "wagmi";
import { http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { liquidConnector } from "./liquid-connector";

// Create wagmi configuration with Liquid connector
export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [liquidConnector()],
});
