import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        client: path.resolve(__dirname, "/packages/client/index.html"),
      },
    },
  },
  server: {
    open: "/packages/client/index.html",
    port: 8080,
  },
});
