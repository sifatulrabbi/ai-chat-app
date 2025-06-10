import Redis from "ioredis";
import { REDIS_HOST, REDIS_PORT } from "./constants";
import { type User } from "@supabase/supabase-js";
import { ProfileModel } from "./db/profile-model";

export enum RedisConnStatus {
  "wait" = "wait",
  "reconnecting" = "reconnecting",
  "connecting" = "connecting",
  "connect" = "connect",
  "ready" = "ready",
  "close" = "close",
  "end" = "end",
}
const redisClient = new Redis(REDIS_PORT, REDIS_HOST, {});
// const DAY_IN_MILLI = 24 * 60 * 60 * 1000;

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

export const ensureRedisConnection = async (): Promise<void> => {
  let totalWaitTime = 10_000; // 10 seconds.
  try {
    while (RedisConnStatus.ready !== redisClient.status && totalWaitTime > 0) {
      console.log("Redis connection status:", redisClient.status);
      await new Promise((r) => setTimeout(r, 1000));
      totalWaitTime -= 1000;
    }
    if (redisClient.status !== RedisConnStatus.ready) {
      throw new Error("Unable to stablish redis connection!");
    }
    console.log("Redis connection status:", redisClient.status);
  } catch (err) {
    console.error("Error connecting to Redis", err);
    process.exit(1);
  }
};

const setCache = async <T>(key: string, value: T): Promise<void> => {
  if ((await redisClient.set(key, JSON.stringify(value))) !== "OK") {
    throw new Error("Failed to cache the data!");
  }
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

const setUserCache = async (user: User, profile: typeof ProfileModel) => {
  const k = `user:${user.id}`;
  return await setCache(k, { user, profile });
};

const getUserCache = async (userId: string) => {
  const k = `user:${userId}`;
  return await getCache(k);
};

export const caching = {
  setCache,
  getCache,
  helpers: {
    setUserCache,
    getUserCache,
  },
};
