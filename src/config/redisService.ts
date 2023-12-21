import { RedisClientType, createClient } from "redis";

export class RedisService {
  static cache: RedisClientType;

  static host = process.env.REDIS_HOST || "localhost";
  static port = process.env.REDIS_PORT || 6379;

  static setCache(hashKey: string, time: number, data: any) {
    return this.cache.setEx(hashKey, time, JSON.stringify(data));
  }
  static getCache(hashKey: string) {
    return this.cache.get(hashKey);
  }
  static clearCache(hashKey: string) {
    return this.cache.del(hashKey);
  }
}
