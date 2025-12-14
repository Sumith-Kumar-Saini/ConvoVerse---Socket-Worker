import { Worker } from "bullmq";
import RedisClient from "../common/config/redis";
import { generateNumberStream, generateStream, randomTxt } from "./work";

async function initWorker() {
  // Ensure Redis client is initialized ONCE
  const redis = await RedisClient.getBase();

  // Prepare random text BEFORE worker starts
  const randomText = await randomTxt();

  // Create worker
  const worker = new Worker(
    "llm-msg",
    async (job) => {
      const stream = generateStream(randomText, { rounds: 100, ms: 100 });
      //   const stream = generateNumberStream(100, 100);
      for await (const chunk of stream) {
        process.stdout.write(chunk + "\r\n");
        await redis.publish(
          `job:stream:${job.data.roomId}`,
          JSON.stringify({ chunk, roomId: job.data.roomId })
        );
      }
      await redis.publish(
        `job:end:${job.data.roomId}`,
        JSON.stringify({ roomId: job.data.roomId })
      );
    },
    {
      connection: redis,
      concurrency: 50,
      removeOnComplete: { count: 5 },
      removeOnFail: { count: 0 },
    }
  );

  worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
  });

  worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
  });
}

initWorker().catch((err) => {
  console.error("Worker initialization failed:", err);
  process.exit(1);
});
