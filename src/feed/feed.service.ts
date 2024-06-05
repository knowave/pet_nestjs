import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { User } from 'src/user/entities/user.entity';
import { FeedRepository } from './repo/feed.repository';
import { Feed } from './entities/feed.entity';
import { FEED_NOT_FOUND } from './error/feed.error';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class FeedService {
  constructor(
    private readonly feedRepository: FeedRepository,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async createFeed(createFeedDto: CreateFeedDto, user: User): Promise<boolean> {
    const { content, title, thumbnail } = createFeedDto;

    await this.feedRepository.save(
      new Feed({
        content,
        title,
        thumbnail,
        user,
      }),
    );
    return true;
  }

  findAll() {
    return `This action returns all feed`;
  }

  async getMyFeed(feedId: string, userId: string): Promise<Feed> {
    const feed = await this.feedRepository.getFeedByFeedIdAndUserId(
      feedId,
      userId,
    );

    if (!feed) throw new NotFoundException(FEED_NOT_FOUND);

    return feed;
  }

  async getPublicFeed(feedId: string): Promise<Feed> {
    const feed = await this.feedRepository.getFeedByFeedIdAndIsPublic(feedId);

    if (!feed) throw new NotFoundException(FEED_NOT_FOUND);

    return feed;
  }

  async incrementViewCount(feedId: string): Promise<boolean> {
    const feed = await this.feedRepository.getFeedByFeedIdAndIsPublic(feedId);

    if (!feed) throw new NotFoundException(FEED_NOT_FOUND);

    await this.feedRepository.increment(feedId);
    return true;
  }

  async topTenFeeds(): Promise<Feed[]> {
    const topTenFeeds = await this.redis.get('topTenFeeds');

    if (topTenFeeds) return JSON.parse(topTenFeeds);

    const feeds = await this.feedRepository.getTopTenFeedsAndSortViewCount();
    await this.redis.set('topTenFeeds', JSON.stringify(feeds), 'EX', 60);

    return feeds;
  }

  update(id: number, updateFeedDto: UpdateFeedDto) {
    return `This action updates a #${id} feed`;
  }

  remove(id: number) {
    return `This action removes a #${id} feed`;
  }
}
