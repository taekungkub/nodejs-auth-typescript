import { RedisClientType } from "redis";

export class RedisService {
  static cache: RedisClientType;
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
