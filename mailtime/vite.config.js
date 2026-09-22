import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
const appDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      react: path.resolve(appDirectory, "node_modules/react"),
      "react-dom": path.resolve(appDirectory, "node_modules/react-dom"),
    },
  },
});