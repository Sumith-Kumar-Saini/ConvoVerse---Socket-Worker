import "dotenv/config";

const _config = {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST,
};

const ENV = Object.freeze(_config);

export default ENV;
