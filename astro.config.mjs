// astro.config.mjs
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  devToolbar: {
    enabled: false
  },
  integrations: [
    react(), // Enable React components
    tailwind(), // Enable Tailwind CSS
  ],
  // Enable building of dynamic routes
  build: {
    format: "directory",
  },
});
