import { Injectable, NotFoundException } from '@nestjs/common';
import { LikeRepository } from './repo/like.repository';
import { FeedRepository } from 'src/feed/repo/feed.repository';
import { CommentRepository } from 'src/comment/repo/comment.repository';
import { FEED_NOT_FOUND } from 'src/feed/error/feed.error';
import { User } from 'src/user/entities/user.entity';
import { Like } from './entities/like.entity';
import { COMMENT_NOT_FOUND } from 'src/comment/error/comment.error';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IPage } from 'src/common/types/page';

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
      await this.feedRepository.decrementLikeCount(feedId);
      return false;
    } else {
      await this.likeRepository.save(new Like({ feed, user }));
      await this.feedRepository.incrementLikeCount(feedId);
      return true;
    }
  }

  async commentLike(commentId: string, user: User): Promise<boolean> {
    const comment = await this.commentRepository.getCommentById(commentId);
    const isLike = await this.likeRepository.getLikeByCommentIdAndUserId(
      commentId,
      user.id,
    );

    if (!comment) throw new NotFoundException(COMMENT_NOT_FOUND);

    if (isLike) {
      await this.likeRepository.softRemove(isLike);
      await this.commentRepository.decrementLikeCount(commentId);
      return false;
    } else {
      await this.likeRepository.save(new Like({ comment, user }));
      await this.commentRepository.incrementLikeCount(commentId);
      return true;
    }
  }

  async getMyLikeFeed(
    paginationDto: PaginationDto,
    userId: string,
  ): Promise<IPage<Like>> {
    const [likes, totalCount] =
      await this.likeRepository.getLikesByUserIdWithFeed(paginationDto, userId);

    return {
      data: likes,
      totalCount,
      pageInfo: {
        currentPage: paginationDto.page,
        totalPages: Math.ceil(totalCount / paginationDto.limit),
        hasNextPage: paginationDto.page * paginationDto.limit < totalCount,
      },
    };
  }
}
