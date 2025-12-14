import "dotenv/config";
import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import appConfig from "./config/fastify";
import { socketPlugin } from "./plugins/socket";
import fastifyCors from "@fastify/cors";

export const buildApp = function () {
  const server = fastify(appConfig);

  const allowedOrigins = (
    process.env.ALLOWED_ORIGINS || "http://localhost:5173"
  ).split(",");

  server.register(fastifyCors, {
    origin: allowedOrigins,
  });

  server.register(fastifyIO, {
    cors: { origin: allowedOrigins },
  });
  server.register(socketPlugin);

  server.get("/*", () => "Hello world");

  return server;
};
