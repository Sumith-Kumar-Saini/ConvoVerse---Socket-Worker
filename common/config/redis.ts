import Redis from "ioredis";
import ENV from "../../src/config/env";

export default class RedisClient {
  private static base: Redis | null = null;
  private static pub: Redis | null = null;
  private static sub: Redis | null = null;

  /** Base connection */
  static async getBase(): Promise<Redis> {
    if (this.base) return this.base;

    this.base = new Redis({
      host: ENV.REDIS.HOST,
      port: ENV.REDIS.PORT,
      maxRetriesPerRequest: null,
    });

    return this.base;
  }

  /** Publisher singleton */
  static async getPublisher(): Promise<Redis> {
    if (this.pub) return this.pub;

    const base = await this.getBase();
    this.pub = base.duplicate();
    return new Promise((resolve, reject) =>
      this.pub!.once("ready", () => resolve(this.pub!)).once("error", reject)
    );
  }

  /** Subscriber singleton (THE IMPORTANT FIX) */
  static async getSubscriber(): Promise<Redis> {
    if (this.sub) return this.sub;

    const base = await this.getBase();
    this.sub = base.duplicate();
    return new Promise((resolve, reject) =>
      this.sub!.once("ready", () => resolve(this.sub!)).once("error", reject)
    );
  }

  /** -------------------------
   *  CLEANUP
   *  ------------------------*/
  static async close(): Promise<void> {
    if (this.base) {
      this.base.disconnect();
      this.base = null;
    }
    if (this.pub) {
      this.pub.disconnect();
      this.pub = null;
    }
    if (this.sub) {
      this.sub.disconnect();
      this.sub = null;
    }
  }
}
