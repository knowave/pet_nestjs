import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { FeedRepositoryModule } from 'src/feed/repo/feed.repository.module';
import { CommentRepositoryModule } from './repo/comment.repository.module';

@Module({
  imports: [CommentRepositoryModule, FeedRepositoryModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
