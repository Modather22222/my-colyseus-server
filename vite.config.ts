import { defineConfig } from "vite";
import { colyseus } from "colyseus/vite";

export default defineConfig(({ mode }) => ({
  build: { outDir: "dist/client" },
  plugins: [
    // The plugin declares a second build environment (dist/server), so every
    // `vite build` builds both halves. `--mode client` drops it when you only
    // want the static client — e.g. deploying it separately from the server.
    // That mode also swaps which .env.* file Vite loads: .env.client, not
    // .env.production. Only matters once you add a VITE_-prefixed var.
    ...(mode === "client" ? [] : [colyseus({
      serverEntry: "/src/app.config.ts",
      // The generated dist/server/server.mjs calls `server.listen(<port>)` with
      // whatever this option holds, interpolated verbatim. Passing a runtime
      // expression (cast past the number type) makes the deployed server bind
      // to the host-assigned port — Render/Fly/Railway set PORT per instance,
      // so a number baked at build time would break there.
      port: "(Number(process.env.PORT) || 2567)" as any,
      // Serve dist/client through the production server, so the deployed
      // service hosts both the game page and its WebSocket server on one URL.
      serveClient: true,
    })]),
  ],
}));
