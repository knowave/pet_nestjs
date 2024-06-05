import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { REDIS_HOST, REDIS_PORT } from 'src/common/env';

@Module({
  imports: [
    RedisModule.forRoot({
      config: {
        host: REDIS_HOST,
        port: +REDIS_PORT,
      },
    }),
  ],
})
export class RedisConfigModule {}
