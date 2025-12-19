import { createContainer } from "@di";
import { createApp } from "./app";
import { createServer } from "http";
import { Server } from "socket.io";
import { setupSocket } from "./socket/setup.socket";
import { env } from "./config/env";

export const bootstrap = async () => {
  const container = createContainer();

  const app = createApp(container);

  const httpServer = createServer(app);

  const io = new Server(httpServer, {
    cors: { origin: env.FRONTEND_URL, credentials: true },
  });

  setupSocket(io, container);

  httpServer.listen(env.PORT, () => {
    console.log(`Server started on port ${env.PORT}`);
  });
};
