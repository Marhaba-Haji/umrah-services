import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    historyApiFallback: true,
    proxy: {
      "/api/airservice/rest/search": {
        target: "https://www.stagingapi.bdsd.technology",
        changeOrigin: true,
        secure: false,
        headers: {
          Username: "TTS",
          Password: "Tts@001",
        },
        // Do not rewrite the path; backend expects /api/airservice/rest/search
      },
      "/api/farerule": {
        target: "https://www.stagingapi.bdsd.technology",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/api\/farerule/, "/api/airservice/rest/farerule"),
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean,
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1500, // Increase warning limit (default is 500)
    // Removed manualChunks to let Vite handle chunking automatically
  },
}));
