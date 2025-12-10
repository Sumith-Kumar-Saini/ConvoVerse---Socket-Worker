import { FastifyInstance } from "fastify";
import { Socket } from "socket.io";

export default interface SocketController {
  handle(fastify: FastifyInstance, socket: Socket): void;
}
