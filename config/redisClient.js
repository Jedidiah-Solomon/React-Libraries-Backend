const { createClient } = require("redis");
const redisClient = createClient({
  url: `redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

redisClient.connect().catch(console.error);

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

module.exports = redisClient;
