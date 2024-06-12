import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { User } from 'src/user/entities/user.entity';
import { FeedRepository } from './repo/feed.repository';
import { Feed } from './entities/feed.entity';
import { FEED_NOT_FOUND } from './error/feed.error';
import { RedisService } from 'src/database/redis/redis.service';
import { S3Service } from 'src/s3/s3.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FeedService {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly redisService: RedisService,
    private readonly s3Service: S3Service,
  ) {}

  async createFeed(createFeedDto: CreateFeedDto, user: User): Promise<boolean> {
    const { content, title, thumbnail } = createFeedDto;

    let thumbnailImage: string;

    if (thumbnail) {
      const { fileName, mimeType, fileContent } = thumbnail;
      const newFileName = `${uuid()}-${fileName}`;

      const uploadFile = await this.s3Service.uploadObject(
        newFileName,
        fileContent,
        mimeType,
      );

      thumbnailImage = uploadFile.Key;
    }

    await this.feedRepository.save(
      new Feed({
        content,
        title,
        thumbnail: thumbnailImage ?? null,
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
    const topTenFeeds = await this.redisService.get('topTenFeeds');

    if (topTenFeeds) return JSON.parse(topTenFeeds);

    const feeds = await this.feedRepository.getTopTenFeedsAndSortViewCount();
    await this.redisService.set('topTenFeeds', JSON.stringify(feeds), 'EX', 60);

    return feeds;
  }

  async updateFeed(
    feedId: string,
    updateFeedDto: UpdateFeedDto,
    userId: string,
  ): Promise<boolean> {
    const { content, title, thumbnail, isPublic } = updateFeedDto;

    const feed = await this.feedRepository.getFeedByFeedIdAndUserId(
      feedId,
      userId,
    );

    if (!feed) throw new NotFoundException(FEED_NOT_FOUND);

    if (thumbnail) {
      if (feed.thumbnail) {
        const urlArr = feed.thumbnail.split('/');
        const fileName = urlArr.slice(-1)[0];
        await this.s3Service.deleteObject(fileName);
      }

      const { fileName, mimeType, fileContent } = thumbnail;
      const newFileName = `${uuid()}-${fileName}`;

      const uploadedFile = await this.s3Service.uploadObject(
        newFileName,
        fileContent,
        mimeType,
      );

      feed.thumbnail = uploadedFile.Key;
    }

    feed.content = content;
    feed.title = title;
    feed.isPublic = isPublic;

    await this.feedRepository.save(feed);
    return true;
  }

  async removeFeed(feedId: string, userId: string): Promise<boolean> {
    const feed = await this.feedRepository.getFeedByFeedIdAndUserId(
      feedId,
      userId,
    );

    const urlArr = feed.thumbnail.split('/');
    const fileName = urlArr.slice(-1)[0];

    await this.s3Service.deleteObject(fileName);
    await this.feedRepository.softRemove(feedId);
    return true;
  }
}
