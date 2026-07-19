import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    minify: "esbuild",
    lib: {
      entry: {
        "blurhash-url": resolve(__dirname, "lib/blurhash-url.ts"),
        constants: resolve(__dirname, "lib/constants.ts"),
      },
      fileName: (format, entryName) => (format === "es" ? `${entryName}.js` : `${entryName}.cjs`),
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["visionary-base64url"],
    },
  },
  esbuild: {
    drop: ["console"],
  },
  plugins: [
    dts({
      rollupTypes: true,
    }),
  ],
});
