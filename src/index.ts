import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import appConfig from "./config/fastify";
import { socketPlugin } from "./plugins/socket";
import fastifyCors from "@fastify/cors";

export const buildApp = function () {
  const server = fastify(appConfig);

  server.register(fastifyCors, {
    origin: "http://localhost:5173",
  });

  server.register(fastifyIO, {
    cors: { origin: "http://localhost:5173" },
  });
  server.register(socketPlugin);

  server.get("/*", () => "Hello world");

  return server;
};
