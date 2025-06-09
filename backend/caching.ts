import { createClient } from "redis";

const redisClient = process.env.REDIS_URL
  ? createClient({ url: process.env.REDIS_URL })
  : createClient({
      socket: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: parseInt(process.env.REDIS_PORT || "6379", 10),
      },
      password: process.env.REDIS_PASSWORD,
    });

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

export const ensureRedisConnection = async (): Promise<void> => {
  try {
    await redisClient.connect();
    console.log("Redis connected");
  } catch (err) {
    console.error("Error connecting to Redis", err);
    process.exit(1);
  }
};

const DAY_IN_SECONDS = 24 * 60 * 60;

const setCache = async <T>(
  key: string,
  value: T,
  expireInSeconds: number = DAY_IN_SECONDS * 2,
): Promise<void> => {
  await redisClient.set(key, JSON.stringify(value), {
    EX: expireInSeconds,
  });
};

const getCache = async <T>(key: string): Promise<T | null> => {
  const data = await redisClient.get(key);
  if (!data) return null;
  try {
    return JSON.parse(data) as T;
  } catch (err) {
    console.error("Error parsing cached data", err);
    return null;
  }
};

export const caching = {
  setCache,
  getCache,
};
