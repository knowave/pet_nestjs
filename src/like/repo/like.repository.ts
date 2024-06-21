import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from '../entities/like.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class LikeRepository {
  constructor(
    @InjectRepository(Like) private readonly repository: Repository<Like>,
  ) {}

  async save(like: Like): Promise<Like> {
    return await this.repository.save(like);
  }

  async softRemove(like: Like): Promise<void> {
    await this.repository.softRemove(like);
  }

  async getLikeByFeedIdAndUserId(
    feedId: string,
    userId: string,
  ): Promise<Like> {
    return await this.repository
      .createQueryBuilder('like')
      .where('like.feedId = :feedId', { feedId })
      .andWhere('like.userId = :userId', { userId })
      .getOne();
  }

  async getLikeByCommentIdAndUserId(
    commentId: string,
    userId: string,
  ): Promise<Like> {
    return await this.repository
      .createQueryBuilder('like')
      .where('like.commentId = :commentId', { commentId })
      .andWhere('like.userId = :userId', { userId })
      .getOne();
  }

  async getLikesByUserIdWithFeed(
    paginationDto: PaginationDto,
    userId: string,
  ): Promise<[Like[], number]> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    return await this.repository
      .createQueryBuilder('like')
      .innerJoin('like.feed', 'feed')
      .addSelect(['feed.id', 'feed.content', 'feed.thumbnail'])
      .where('like.userId= :userId', { userId })
      .offset(skip)
      .limit(limit)
      .getManyAndCount();
  }
}
