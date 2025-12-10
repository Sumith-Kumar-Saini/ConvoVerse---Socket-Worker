import { FastifyInstance } from "fastify";
import { ChatSocketController } from "../controllers/chat";

export const socketPlugin = (fastify: FastifyInstance) => {
  fastify.io.on("connection", (socket) => {
    new ChatSocketController().handle(fastify, socket);
  });
};
