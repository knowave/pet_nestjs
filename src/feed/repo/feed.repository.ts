import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feed } from '../entities/feed.entity';
import { Repository } from 'typeorm';

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
      .innerJoinAndSelect('feed.user', 'user')
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

  async getFeedsByPublic(page?: number, limit?: number): Promise<Feed[]> {
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
      .where('feed.isPublic = true')
      .orderBy('feed.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();
  }
}
