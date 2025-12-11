import { FastifyInstance } from "fastify";
import { ChatSocketController } from "../controllers/chat";
import { initJobSubscriber } from "../services/subscriber";

export const socketPlugin = (fastify: FastifyInstance) => {
  fastify.io.on("connection", (socket) => {
    new ChatSocketController().handle(fastify, socket);
  });

  fastify.ready().then(() => {
    initJobSubscriber(fastify); // runs only once
  });
};
