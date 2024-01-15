import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: [resolve(__dirname, "lib/constants.ts"), resolve(__dirname, "lib/visionary-url.ts")],
    },
  },
  plugins: [
    dts({
      rollupTypes: true,
    }),
  ],
});
