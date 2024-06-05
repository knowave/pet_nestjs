import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async get(key: string): Promise<string> {
    return this.redis.get(key);
  }

  set(
    key: string,
    value: string | Buffer | number,
    secondsToken?: 'EX',
    seconds?: number | string,
  ): Promise<string> {
    return this.redis.set(key, value, secondsToken, seconds);
  }

  async del(key: string): Promise<number> {
    return this.redis.del(key);
  }
}
