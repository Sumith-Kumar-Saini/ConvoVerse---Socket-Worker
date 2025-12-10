import fastify from "fastify";
import ENV from "./config/env";
import appConfig from "./config/fastify";

export const buildApp = function () {
  const server = fastify(appConfig);

  server.get("/*", () => "Hello world");

  return server;
};
