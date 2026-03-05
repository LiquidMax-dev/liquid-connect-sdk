export { createSolanaPlugin } from "./plugin";
export type { LiquidSolanaProvider, SolanaSignInData } from "./types";
import type { ISolanaChain } from "@liquid/chain-interfaces";

declare module "../index" {
  interface Liquid {
    solana: ISolanaChain;
  }
}
