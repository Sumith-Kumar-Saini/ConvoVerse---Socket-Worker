import { Worker } from "bullmq";
import RedisClient from "../common/config/redis";
import { generateStream, randomTxt } from "./work";

const redis_url = process.env.REDIS_URL || "redis://localhost:6379";

RedisClient.setupClient(redis_url);
const connection = RedisClient.getClient();

let randomText: string | null = null;

(async () => {
  randomText = await randomTxt();
})();

new Worker(
  "llm-msg",
  async (job) => {
    const stream = generateStream(randomText!);
    const redisClient = RedisClient.getClient();
    for await (const chunk of stream) {
      await redisClient.publish(`job:${job.id}`, JSON.stringify({ chunk }));
    }
    await redisClient.publish(
      `job:${job.id}`,
      JSON.stringify({ completed: true })
    );
  },
  { connection }
);
