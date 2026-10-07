import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The dev server runs on port 3000 - this must match the CORS origin in the backend
export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
});
