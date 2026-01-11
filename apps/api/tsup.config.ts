import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  target: "bun",
  outDir: "dist",
  clean: true,
  splitting: false,
  sourcemap: true,
  dts: false,
  noExternal: ["@gitbruv/auth", "@gitbruv/db"],
  external: ["bun"],
});
