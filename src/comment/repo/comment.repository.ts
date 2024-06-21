import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginationEnum } from 'src/common/enums/pagination.enum';
import { GetCommentByCommentIdAndFeedIdAndUserIdDto } from './dto/get-comment-by-comment-id-and-feed-id-and-user-id.dto';

@Injectable()
export class CommentRepository {
  constructor(
    @InjectRepository(Comment)
    private readonly repository: Repository<Comment>,
  ) {}

  async save(comment: Comment): Promise<Comment> {
    return this.repository.save(comment);
  }

  async getCommentsByFeedId(
    paginationDto: PaginationDto,
    feedId: string,
  ): Promise<[Comment[], number]> {
    const { page, limit, sort } = paginationDto;
    const skip = (page - 1) * limit;

    const qb = this.repository
      .createQueryBuilder('comment')
      .innerJoin('comment.user', 'user')
      .addSelect(['user.id', 'user.nickname', 'user.profileImage'])
      .where('comment.feedId = :feedId', { feedId });

    switch (sort) {
      case PaginationEnum.CREATE_DATE_ASC:
        qb.orderBy('comment.createdAt', 'ASC');
        break;
      case PaginationEnum.CREATE_DATE_DESC:
        qb.orderBy('comment.createdAt', 'DESC');
        break;

      default:
        qb.orderBy('comment.createdAt', 'DESC');
        break;
    }

    qb.offset(skip).limit(limit);
    return await qb.getManyAndCount();
  }

  async getCommentByFeedIdAndUserId(
    feedId: string,
    userId: string,
  ): Promise<Comment> {
    return await this.repository
      .createQueryBuilder('comment')
      .where('comment.feedId = :feedId', { feedId })
      .andWhere('comment.userId = :userId', { userId })
      .getOne();
  }

  async getCommentByCommentIdAndFeedIdAndUserId(
    getCommentByCommentIdAndFeedIdAndUserIdDto: GetCommentByCommentIdAndFeedIdAndUserIdDto,
  ) {
    const { commentId, feedId, userId } =
      getCommentByCommentIdAndFeedIdAndUserIdDto;

    return await this.repository
      .createQueryBuilder('comment')
      .where('comment.id = :commentId', { commentId })
      .andWhere('comment.feedId = :feedId', { feedId })
      .andWhere('comment.userId = :userId', { userId })
      .getOne();
  }

  async softRemove(comment: Comment): Promise<void> {
    await this.repository.softRemove(comment);
  }
}
