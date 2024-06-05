import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { FeedRepositoryModule } from './repo/feed.repository.module';
import { RedisConfigModule } from 'src/database/redis/redis.config.module';

@Module({
  imports: [FeedRepositoryModule, RedisConfigModule],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
