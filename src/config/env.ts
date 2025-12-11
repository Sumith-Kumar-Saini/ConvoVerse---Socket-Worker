import "dotenv/config";

const _config = {
  PORT: parseInt(process.env.PORT || "3000", 10),
  HOST: process.env.HOST,
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
  REDIS: {
    HOST: process.env.REDIS_HOST || "localhost",
    PORT: parseInt(process.env.REDIS_PORT!, 10) || 6379,
  },
};

const ENV = Object.freeze(_config);

export default ENV;
