import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
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
  plugins: [
    dts({
      rollupTypes: true,
    }),
  ],
});
