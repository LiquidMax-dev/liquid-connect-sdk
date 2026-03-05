import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  external: ["react", "react-dom", "@liquid/browser-sdk"],
  noExternal: [],
  platform: "browser",
  shims: true,
});
