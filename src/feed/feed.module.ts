import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { FeedRepositoryModule } from './repo/feed.repository.module';
import { RedisConfigModule } from 'src/database/redis/redis.config.module';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [FeedRepositoryModule, RedisConfigModule, S3Module],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
