import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/API": {
        target: "http://localhost", // XAMPP root
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/API/, "/Data-Kunjungan"),
      },
    },
  },
});
