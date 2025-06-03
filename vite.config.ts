
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Add support for Node.js globals in browser
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['@ai-sdk/google', '@ai-sdk/react', 'ai'],
  },
  build: {
    rollupOptions: {
      external: [],
    },
  },
}));
