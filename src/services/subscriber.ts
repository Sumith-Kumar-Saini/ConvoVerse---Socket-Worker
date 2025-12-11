import { FastifyInstance } from "fastify";
import RedisClient from "../../common/config/redis";

export async function initJobSubscriber(fastify: FastifyInstance) {
  const sub = await RedisClient.getSubscriber();

  await sub.subscribe("job:stream", "job:end");

  sub.on("message", (channel, message) => {
    const data = JSON.parse(message);

    if (channel === "job:stream") {
      fastify.io.to(data.roomId).emit("msg:stream", String(data.chunk));
    }

    if (channel === "job:end") {
      fastify.io.to(data.roomId).emit("msg:end", "");
    }
  });
}
