import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: "**/*.svg?react",
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "maskable-icon.svg"],
      manifest: {
        name: "Tageskram",
        short_name: "Tageskram",
        description: "Tracke jeden Tag deine Stimmung und alles was du willst.",
        display: "standalone",
        orientation: "portrait",
        theme_color: "#ffffff",
        background_color: "#02585e",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "maskable-icon.svg",
            sizes: "512x512",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
