import Redis from "ioredis";

export default class RedisClient {
  private static instance: Redis | null = null;
  static setupClient(redis_url: string) {
    this.instance = new Redis(redis_url);
  }
  static getClient() {
    if (this.instance) return this.instance;
    throw new Error("Redis Server haven't connected");
  }
  static close(reconnect?: boolean) {
    this.instance?.disconnect(reconnect);
  }
}
