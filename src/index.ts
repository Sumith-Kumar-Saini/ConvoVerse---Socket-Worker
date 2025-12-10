import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import appConfig from "./config/fastify";
import { socketPlugin } from "./plugins/socket";

export const buildApp = function () {
  const server = fastify(appConfig);

  server.register(fastifyIO, {
    cors: { origin: "*", methods: ["GET", "POST"] },
  });
  server.register(socketPlugin);

  server.get("/*", () => "Hello world");

  return server;
};
