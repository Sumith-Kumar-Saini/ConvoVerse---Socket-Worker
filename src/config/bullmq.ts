import RedisClient from "../../common/config/redis";
import { Queue } from "bullmq";

export class LLMQueue {
  private static instance: Queue | null = null;

  static async getLLMQueue(): Promise<Queue> {
    if (this.instance) return this.instance;
    const connection = await RedisClient.getBase();
    this.instance = new Queue("llm-msg", { connection });
    return this.instance;
  }
}
