import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { FeedRepository } from 'src/feed/repo/feed.repository';
import { FEED_NOT_FOUND } from 'src/feed/error/feed.error';
import { CommentRepository } from './repo/comment.repository';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  async createComment(user: User, comment: string, feedId: string) {
    const feed = await this.feedRepository.getFeedByFeedIdAndIsPublic(feedId);

    if (!feed) throw new NotFoundException(FEED_NOT_FOUND);

    await this.commentRepository.save(
      new Comment({
        comment,
        feed,
        user,
      }),
    );
    return true;
  }
}
