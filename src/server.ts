import { buildApp } from ".";
import ENV from "./config/env";
import RedisClient from "./config/redis";

const fastify = buildApp();

const start = async () => {
  try {
    await fastify.listen({ port: ENV.PORT, host: ENV.HOST });
    // RedisClient.setupClient(ENV.REDIS_URL);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
