import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Forket from '../../forket'

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
      input: "./build/main.tsx"
    }
  }
});
