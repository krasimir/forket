import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  appType: "custom",
  build: {
    outDir: "dist/client",
    manifest: true,
    rollupOptions: { input: "/build/entry-client.tsx" }
  }
});
