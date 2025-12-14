import { FastifyInstance } from "fastify";
import RedisClient from "../../common/config/redis";

export async function dynamicInitJobSubscriber(
  fastify: FastifyInstance,
  roomId: string
): Promise<void> {
  const sub = await RedisClient.getSubscriber();
  const events = [`job:stream:${roomId}`, `job:end:${roomId}`];
  await sub.subscribe(...events);
  sub.on("message", async (channel, message) => {
    const data = JSON.parse(message) as { chunk?: string; roomId: string };
    if (channel === events[0])
      fastify.io.to(data.roomId).emit("msg:stream", String(data.chunk));
    if (channel === events[1]) {
      fastify.io.to(data.roomId).emit("msg:end");
      await sub.unsubscribe(...events);
    }
  });
}
