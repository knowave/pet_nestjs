import { Module } from '@nestjs/common';
import { LikeService as LikeService } from './like.service';
import { LikeController } from './like.controller';
import { LikeRepositoryModule } from './repo/like.repository.module';
import { FeedRepositoryModule } from 'src/feed/repo/feed.repository.module';
import { CommentRepositoryModule } from 'src/comment/repo/comment.repository.module';

@Module({
  imports: [
    LikeRepositoryModule,
    FeedRepositoryModule,
    CommentRepositoryModule,
  ],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
