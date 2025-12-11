import { buildApp } from ".";
import ENV from "./config/env";
import RedisClient from "../common/config/redis";

const fastify = buildApp();

async function start() {
  try {
    await RedisClient.getBase();
    await fastify.listen({
      port: ENV.PORT,
      host: ENV.HOST,
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
