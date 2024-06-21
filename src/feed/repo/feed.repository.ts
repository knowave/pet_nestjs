import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feed } from '../entities/feed.entity';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginationEnum } from 'src/common/enums/pagination.enum';

@Injectable()
export class FeedRepository {
  constructor(
    @InjectRepository(Feed) private readonly repository: Repository<Feed>,
  ) {}

  async save(feed: Feed): Promise<Feed> {
    return await this.repository.save(feed);
  }

  async getFeedByFeedIdAndUserId(
    feedId: string,
    userId: string,
  ): Promise<Feed> {
    return await this.repository
      .createQueryBuilder('feed')
      .innerJoinAndSelect('feed.user', 'user')
      .where('feed.id = :feedId', { feedId })
      .andWhere('feed.userId = :userId', { userId })
      .getOne();
  }

  async getFeedByFeedIdAndIsPublic(feedId: string): Promise<Feed> {
    return await this.repository
      .createQueryBuilder('feed')
      .innerJoin('feed.user', 'user')
      .leftJoin('feed.comments', 'comment')
      .innerJoin('comment.user', 'commentUser')
      .addSelect(['user.id', 'user.username', 'user.profileImage'])
      .addSelect(['comment.id', 'comment.content', 'comment.createdAt'])
      .addSelect([
        'commentUser.id',
        'commentUser.username',
        'commentUser.profileImage',
      ])
      .where('feed.id = :feedId', { feedId })
      .andWhere('feed.isPublic = true')
      .getOne();
  }

  async increment(feedId: string): Promise<void> {
    await this.repository.increment({ id: feedId }, 'viewCount', 1);
  }

  async getTopTenFeedsAndSortViewCount(): Promise<Feed[]> {
    return await this.repository
      .createQueryBuilder('feed')
      .where('user.isPublic = true')
      .orderBy('feed.viewCount', 'DESC')
      .addOrderBy('feed.createdAt', 'DESC')
      .limit(10)
      .getMany();
  }

  async softRemove(feedId: string): Promise<void> {
    await this.repository.softDelete({ id: feedId });
  }

  async getFeedsByPublic(
    paginationDto: PaginationDto,
  ): Promise<[Feed[], number]> {
    const { page, limit, sort } = paginationDto;
    const skip = (page - 1) * limit;

    const qb = this.repository
      .createQueryBuilder('feed')
      .innerJoin('feed.user', 'user')
      .select([
        'feed.id',
        'feed.title',
        'feed.content',
        'feed.thumbnail',
        'feed.createdAt',
        'feed.viewCount',
        'user.id',
        'user.username',
        'user.profileImage',
      ])
      .where('feed.isPublic = true');

    switch (sort) {
      case PaginationEnum.CREATE_DATE_ASC:
        qb.orderBy('feed.createdAt', 'ASC');
        break;
      case PaginationEnum.CREATE_DATE_DESC:
        qb.orderBy('feed.createdAt', 'DESC');
        break;
      case PaginationEnum.VIEW_COUNT_ASC:
        qb.orderBy('feed.viewCount', 'ASC');
        break;
      case PaginationEnum.VIEW_COUNT_DESC:
        qb.orderBy('feed.viewCount', 'DESC');
        break;

      default:
        qb.orderBy('feed.createdAt', 'DESC');
        break;
    }

    qb.skip(skip).take(limit);
    return await qb.getManyAndCount();
  }

  async getFeedsByUserId(
    paginationDto: PaginationDto,
    userId: string,
  ): Promise<[Feed[], number]> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    return await this.repository
      .createQueryBuilder('feed')
      .innerJoin('feed.user', 'user')
      .select([
        'feed.id',
        'feed.title',
        'feed.content',
        'feed.thumbnail',
        'feed.createdAt',
        'user.id',
        'user.username',
        'user.profileImage',
      ])
      .where('feed.userId = :userId', { userId })
      .orderBy('feed.createdAt', 'DESC')
      .skip(skip)
      .limit(limit)
      .getManyAndCount();
  }

  async getFeedById(feedId: string): Promise<Feed> {
    return await this.repository
      .createQueryBuilder('feed')
      .where('feed.id = :feedId', { feedId })
      .getOne();
  }
}
