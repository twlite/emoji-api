import { defineConfig } from "tsup";

export default defineConfig({
    clean: true,
    outDir: "./build",
    format: ["cjs", "esm"],
    dts: true,
    entry: ["./src/index.ts"],
    skipNodeModulesBundle: true,
    keepNames: true,
    minify: false,
    sourcemap: true
});