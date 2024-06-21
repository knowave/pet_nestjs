import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { FeedRepository } from 'src/feed/repo/feed.repository';
import { FEED_NOT_FOUND } from 'src/feed/error/feed.error';
import { CommentRepository } from './repo/comment.repository';
import { Comment } from './entities/comment.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IPage } from 'src/common/types/page';

@Injectable()
export class CommentService {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  async createComment(user: User, content: string, feedId: string) {
    const feed = await this.feedRepository.getFeedByFeedIdAndIsPublic(feedId);

    if (!feed) throw new NotFoundException(FEED_NOT_FOUND);

    await this.commentRepository.save(
      new Comment({
        content,
        feed,
        user,
      }),
    );
    return true;
  }

  async getCommentsByFeedId(
    paginationDto: PaginationDto,
    feedId: string,
  ): Promise<IPage<Comment>> {
    const [comments, totalCount] =
      await this.commentRepository.getCommentsByFeedId(paginationDto, feedId);

    return {
      data: comments,
      totalCount,
      pageInfo: {
        currentPage: paginationDto.page,
        totalPages: Math.ceil(totalCount / paginationDto.limit),
        hasNextPage: paginationDto.page * paginationDto.limit < totalCount,
      },
    };
  }
}
