import { build as viteBuild } from "vite";
import Forket from "forket";
import react from "@vitejs/plugin-react";

import { BUILD, DIST } from "./constants.js";

Forket({
  printGraph: true
}).then((forket) => {
  forket.process().then(async () => {
    await viteBuild({
      plugins: [react()],
      build: {
        outDir: DIST,
        manifest: true,
        ssrManifest: true,
        rollupOptions: { input: `${BUILD}/client/client.tsx` }
      }
    });
  });
})