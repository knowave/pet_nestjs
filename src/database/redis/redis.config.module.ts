import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { InjectRedis, RedisModule } from '@liaoliaots/nestjs-redis';
import { REDIS_HOST, REDIS_PORT } from 'src/common/env';
import { Redis } from 'ioredis';
import { RedisService } from './redis.service';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        host: REDIS_HOST,
        port: +REDIS_PORT,
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisConfigModule implements OnModuleInit {
  private readonly logger = new Logger(RedisConfigModule.name);
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async onModuleInit() {
    try {
      await this.redis.ping();
      this.logger.log('Redis module connected');
    } catch (err) {
      this.logger.error('Failed to connect to Redis:', err);
    }
  }
}
