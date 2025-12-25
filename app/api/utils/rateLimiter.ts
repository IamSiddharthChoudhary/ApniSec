export class RateLimiter {
  private tk: number;
  private time: number;
  private store: Map<string, { count: number; expires: number }>;

  constructor(token = 100, time = 900000) {
    this.tk = token;
    this.time = time;
    this.store = new Map();
  }

  async init() {}

  private cleanup() {
    const now = Date.now();
    for (const [ip, data] of this.store.entries()) {
      if (data.expires < now) {
        this.store.delete(ip);
      }
    }
  }

  public async addEntry(ip: string) {
    this.cleanup();
    const now = Date.now();
    const entry = this.store.get(ip);

    if (entry) {
      entry.count++;
    } else {
      this.store.set(ip, { count: 1, expires: now + this.time });
    }
  }

  public async check(ip: string) {
    this.cleanup();
    const entry = this.store.get(ip);

    if (entry && entry.count >= this.tk) {
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
