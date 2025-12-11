import { Socket } from "socket.io";
import SocketController from "../interfaces/socketController";
import { FastifyInstance } from "fastify";
import RedisClient from "../../common/config/redis";
import { LLMQueue } from "../config/bullmq";
import { generateRandomText } from "../utils/randomText";

export class ChatSocketController implements SocketController {
  async handle(fastify: FastifyInstance, socket: Socket): Promise<void> {
    socket.on("message", (message: string, ack: (data: unknown) => void) => {
      ack({ message });
    });

    socket.on(
      "msg:send",
      async (message: string, ack: (data: unknown) => void) => {
        const roomId = generateRandomText();
        socket.join(roomId);
        const Queue = await LLMQueue.getLLMQueue();
        const job = await Queue.add("stream-response", { roomId });
        ack({ jobId: job?.id });
      }
    );
  }
}
