import { Injectable, NotFoundException } from '@nestjs/common';
import { LikeRepository } from './repo/like.repository';
import { FeedRepository } from 'src/feed/repo/feed.repository';
import { CommentRepository } from 'src/comment/repo/comment.repository';
import { FEED_NOT_FOUND } from 'src/feed/error/feed.error';
import { User } from 'src/user/entities/user.entity';
import { Like } from './entities/like.entity';

@Injectable()
export class LikeService {
  constructor(
    private readonly likeRepository: LikeRepository,
    private readonly feedRepository: FeedRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  async feedLike(feedId: string, user: User): Promise<boolean> {
    const feed = await this.feedRepository.getFeedById(feedId);
    const isLike = await this.likeRepository.getLikeByFeedIdAndUserId(
      feedId,
      user.id,
    );

    if (!feed) throw new NotFoundException(FEED_NOT_FOUND);

    if (isLike) {
      await this.likeRepository.softRemove(isLike);
      return false;
    } else {
      await this.likeRepository.save(new Like({ feed, user }));
      return true;
    }
  }
}
