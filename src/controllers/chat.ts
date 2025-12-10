import { Socket } from "socket.io";
import SocketController from "../interfaces/socketController";
import { FastifyInstance } from "fastify";

export class ChatSocketController implements SocketController {
  handle(fastify: FastifyInstance, socket: Socket): void {
    socket.on("message", (message: string, ack: (data: unknown) => void) => {
      fastify.log.info({ socMsg: message });
      ack(message + "server");
    });
  }
}
