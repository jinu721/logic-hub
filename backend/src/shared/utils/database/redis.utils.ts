import redisClient from "../../../config/redis.config";

export const RedisHelper = {
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await redisClient.setEx(key, ttlSeconds, value);
    } else {
      await redisClient.set(key, value);
    }
  },

  async get(key: string): Promise<string | null> {
    return redisClient.get(key);
  },

  async del(key: string): Promise<void> {
    await redisClient.del(key);
  },

  async exists(key: string): Promise<boolean> {
    const result = await redisClient.exists(key);
    return result === 1;
  },
};
