import { FastifyInstance } from "fastify";
import RedisClient from "../../common/config/redis";

const activeRooms = new Set<string>();

export async function dynamicInitJobSubscriber(
  fastify: FastifyInstance,
  roomId: string
) {
  if (activeRooms.has(roomId)) return;
  activeRooms.add(roomId);

  const sub = await RedisClient.getSubscriber();
  const events = [`job:stream:${roomId}`, `job:end:${roomId}`];

  const handler = async (channel: string, message: string) => {
    if (!events.includes(channel)) return;

    const data = JSON.parse(message) as { chunk?: string; roomId: string };

    if (channel === events[0]) {
      fastify.io.to(data.roomId).emit("msg:stream", String(data.chunk));
    }

    if (channel === events[1]) {
      fastify.io.to(data.roomId).emit("msg:end");
      await sub.unsubscribe(...events);
      sub.off("message", handler);
      activeRooms.delete(roomId); // ✅ cleanup
    }
  };

  await sub.subscribe(...events);
  sub.on("message", handler);
}
