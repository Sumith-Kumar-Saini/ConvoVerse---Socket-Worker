import RedisClient from "../../common/config/redis";
import { Queue } from "bullmq";

const connection = RedisClient.getClient();

const LLMQueue = new Queue("llm-msg", { connection });

export { LLMQueue };
