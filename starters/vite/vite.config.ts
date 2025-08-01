import path from 'path';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Forket from 'forket';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    {
      name: "forket",
      async config() {
        await Forket({
          sourceDir: __dirname + '/src',
          buildDir: __dirname + '/build',
        }).process();
      }
    },
    react()
  ],
  build: {
    rollupOptions: {
      input: "./build/server/main.tsx"
    }
  }
});
