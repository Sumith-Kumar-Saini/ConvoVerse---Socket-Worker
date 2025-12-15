import { FastifyInstance } from "fastify";
import RedisClient from "../../common/config/redis";

const activeRooms = new Set<string>();

export async function dynamicInitJobSubscriber(
  fastify: FastifyInstance,
  chatId: string
) {
  if (activeRooms.has(chatId)) return;
  activeRooms.add(chatId);

  const sub = await RedisClient.getSubscriber();
  const events = [`chat:stream:${chatId}`, `chat:end:${chatId}`];

  const handler = async (channel: string, message: string) => {
    if (!events.includes(channel)) return;

    const data = JSON.parse(message) as { chunk?: string; chatId: string };

    if (channel === events[0]) {
      fastify.io.to(data.chatId).emit("msg:stream", String(data.chunk));
    }

    if (channel === events[1]) {
      fastify.io.to(data.chatId).emit("msg:end");
      await sub.unsubscribe(...events);
      sub.off("message", handler);
      activeRooms.delete(chatId); // ✅ cleanup
    }
  };

  await sub.subscribe(...events);
  sub.on("message", handler);
}
