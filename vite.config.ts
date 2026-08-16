// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/tanstack/vite";

// Deploy target: Vercel. Nitro builds the Vercel Build Output API (.vercel/output).
export default defineConfig({
  nitro: { preset: "vercel" },
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [mcpPlugin()],
    build: {
      rollupOptions: {
        // mcp-js dynamically imports cloudflare:workers behind a try/catch with a
        // process.env fallback — safe to externalize on Vercel (Node runtime).
        external: ["cloudflare:workers"],
      },
    },
  },
});
