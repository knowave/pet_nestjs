import { Injectable, NotFoundException } from '@nestjs/common';
import { FeedRepository } from 'src/feed/repo/feed.repository';
import { FEED_NOT_FOUND } from 'src/feed/error/feed.error';
import { CommentRepository } from './repo/comment.repository';
import { Comment } from './entities/comment.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IPage } from 'src/common/types/page';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { COMMENT_NOT_FOUND } from './error/comment.error';

@Injectable()
export class CommentService {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly commentRepository: CommentRepository,
  ) {}

  async createComment(createCommentDto: CreateCommentDto): Promise<boolean> {
    const { user, content, feedId } = createCommentDto;
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

  async updateComment(updateCommentDto: UpdateCommentDto): Promise<boolean> {
    const { feedId, userId, content } = updateCommentDto;
    const comment = await this.commentRepository.getCommentByFeedIdAndUserId(
      feedId,
      userId,
    );

    if (!comment) throw new NotFoundException(COMMENT_NOT_FOUND);

    comment.content = content;
    await this.commentRepository.save(comment);
    return true;
  }
}
