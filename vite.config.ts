import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/cnb": {
        target: "https://www.cnb.cz",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/cnb/, ""),
      },
    },
  },
});
