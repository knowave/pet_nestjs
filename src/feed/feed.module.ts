import { Module } from '@nestjs/common';
import { FeedService } from './feed.service';
import { FeedController } from './feed.controller';
import { FeedRepositoryModule } from './repo/feed.repository.module';

@Module({
  imports: [FeedRepositoryModule],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
