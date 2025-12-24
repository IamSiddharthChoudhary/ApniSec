import { createClient, RedisClientType } from "redis";

export class RateLimiter {
  private tk: number;
  private redisInstance: RedisClientType;
  private time: number;

  constructor(token: number, time = 86400) {
    this.tk = token;
    this.time = time;
    this.redisInstance = createClient();
  }

  async init() {
    if (!this.redisInstance.isOpen) {
      await this.redisInstance.connect();
    }
  }

  public async addEntry(ip: string) {
    const check = await this.redisInstance.get(ip);
    if (check) {
      await this.redisInstance.incr(ip);
    } else {
      await this.redisInstance.set(ip, 1, { EX: this.time });
    }
  }

  public async check(ip: string) {
    const ch = await this.redisInstance.get(ip);
    if (ch && Number(ch) >= this.tk) {
      return false;
    }
    return true;
  }

  public async addReq(ip: string) {
    await this.init();
    const res = await this.check(ip);
    if (res) {
      await this.addEntry(ip);
      return 1;
    } else {
      return 429;
    }
  }
}
