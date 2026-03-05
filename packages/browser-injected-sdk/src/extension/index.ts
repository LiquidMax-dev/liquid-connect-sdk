import type { Extension } from "./plugin";
export { createExtensionPlugin } from "./plugin";
export type { Extension } from "./plugin";

declare module "../index" {
  interface Liquid {
    extension: Extension;
  }
}
