export { createEthereumPlugin } from "./plugin";
export { createSiweMessage } from "./siwe";
export type { LiquidEthereumProvider, EthereumTransaction, EthereumSignInData, EthereumEventType } from "./types";
import type { IEthereumChain } from "@liquid/chain-interfaces";

declare module "../index" {
  interface Liquid {
    ethereum: IEthereumChain;
  }
}
