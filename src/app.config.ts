import {
  defineServer,
  defineRoom,
  monitor,
  playground,
  createRouter,
  createEndpoint,
  LobbyRoom,
} from "colyseus";

/**
 * Import your Room files
 */
import { MyRoom } from "./rooms/MyRoom.js";

const server = defineServer({

  /**
   * Define your room handlers:
   */
  rooms: {
    my_room: defineRoom(MyRoom).enableRealtimeListing(),
    lobby: defineRoom(LobbyRoom),
  },

  /**
   * Experimental: Define API routes. Built-in integration with the "playground" and SDK.
   *
   * Usage from SDK:
   *   client.http.get("/api/hello").then((response) => {})
   *
   */
  routes: createRouter({
    api_hello: createEndpoint("/api/hello", { method: "GET" }, async (ctx) => {
      return { message: "Hello World" };
    }),
    // In production the serveClient SPA fallback is appended before the
    // `express` option's routes, which would shadow plain-express GETs like
    // the /hi sample. Endpoints registered here are matched before express,
    // so they work identically in dev and production.
    api_hi: createEndpoint("/hi", { method: "GET" }, async (ctx) => {
      return { message: "It's time to kick ass and chew bubblegum!" };
    }),
  }),

  /**
   * Bind your custom express routes here:
   * Read more: https://expressjs.com/en/starter/basic-routing.html
   * (Note: with serveClient enabled, production GETs that miss the static
   * files hit the SPA fallback before these — prefer `routes` above for
   * endpoints the client calls.)
   */
  express: (app) => {
    /**
     * Use @colyseus/monitor
     * If you expose it in production, make sure to protect it with a password:
     * https://docs.colyseus.io/tools/monitoring#password-protection
     */
    if (process.env.NODE_ENV !== "production") {
      app.use("/monitor", monitor());
    }

    /**
     * Use @colyseus/playground
     * (It is not recommended to expose this route in a production environment)
     */
    if (process.env.NODE_ENV !== "production") {
      app.use("/playground", playground());
    }
  }
});

export default server;

/** Named export read by the `colyseus/vite` plugin's `serverEntry`. */
export { server };
