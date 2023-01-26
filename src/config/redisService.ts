import { RedisClientType } from "redis";

// export default {
//   async initRedis() {
//     try {
//       client.on("error", (err) => console.log("Redis Client Error", err));
//       await client.connect();
//       return Promise.resolve(client);
//     } catch (error) {
//       return Promise.reject(error);
//     }
//   },
//   async setCache(hashKey: string, time: number, data: any) {
//     return client.setEx(hashKey, time, JSON.stringify(data));
//   },
//   async getCache(hashKey: string) {
//     return client.get(hashKey);
//   },
// };

export class RedisService {
  static cache: RedisClientType;
}
