/**
 * Standalone Vite config — no Lovable packages.
 *
 * Replaces @lovable.dev/vite-tanstack-config with the standard plugins it used
 * to bundle, so the build depends only on TanStack, Vite, Tailwind and Nitro.
 * Deploy target is Vercel: Nitro emits the Build Output API into .vercel/output.
 */
import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

export default defineConfig({
  plugins: [
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    // server.entry -> src/server.ts (the SSR error-page wrapper)
    tanstackStart({ server: { entry: "server" } }),
    nitro({ preset: "vercel" }),
    viteReact(),
  ],
  resolve: {
    alias: { "@": `${process.cwd()}/src` },
    // Prevent duplicate copies breaking hooks / query context
    dedupe: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "@tanstack/react-query",
      "@tanstack/query-core",
    ],
  },
  build: {
    rollupOptions: { external: ["cloudflare:workers"] },
  },
});
