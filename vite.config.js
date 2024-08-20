import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import manifest from "./src/manifest.js";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    build: {
      emptyOutDir: true,
      outDir: "build",
      rollupOptions: {
        output: {
          chunkFileNames: "assets/chunk-[hash].js",
        },
      },
    },

    plugins: [crx({ manifest }), react()],

    test: {
      coverage: {
        reporter: ["text", "html"],
        reportsDirectory: ".coverage",
        thresholds: {
          statements: 1,
          branches: 1,
          functions: 1,
          lines: 1,
        },
      },
    },
  };
});
