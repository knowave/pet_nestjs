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
}
