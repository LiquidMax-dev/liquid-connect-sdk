import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  external: ["buffer", "@liquid/base64url", "@liquid/crypto"],
  target: "es2020",
  platform: "browser",
});
