import { Test, TestingModule } from '@nestjs/testing';
import { FeedService } from './feed.service';
import { FeedRepository } from './repo/feed.repository';
import { User } from 'src/user/entities/user.entity';
import { CreateFeedDto } from './dto/create-feed.dto';
import { Feed } from './entities/feed.entity';
import { FEED_NOT_FOUND } from './error/feed.error';
import { NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { RedisService } from 'src/database/redis/redis.service';

const mockRepository = () => ({
  save: jest.fn(),
  getFeedByFeedIdAndUserId: jest.fn(),
  getFeedByFeedIdAndIsPublic: jest.fn(),
  increment: jest.fn(),
  getTopTenFeedsAndSortViewCount: jest.fn(),
});

const mockRedisService = () => ({
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof FeedRepository, jest.Mock>>;
type MockRedisService<T = any> = Partial<Record<keyof RedisService, jest.Mock>>;

describe('FeedService', () => {
  let service: FeedService;
  let repository: MockRepository<FeedRepository>;
  let redisService: MockRedisService<RedisService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedService,
        {
          provide: FeedRepository,
          useValue: mockRepository(),
        },
        {
          provide: RedisService,
          useValue: mockRedisService(),
        },
      ],
    }).compile();

    service = module.get<FeedService>(FeedService);
    repository = module.get<MockRepository<FeedRepository>>(FeedRepository);
    redisService = module.get<MockRedisService<RedisService>>(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create feed', () => {
    it('Feed를 생성한다.', async () => {
      const user = new User({ id: 'uuid', email: 'test@test.com' });
      const feed: CreateFeedDto = {
        content: 'test content',
        title: 'test title',
        thumbnail: 'test thumbnail',
        isPublic: true,
      };

      repository.save.mockResolvedValue(feed);
      const result = await service.createFeed(feed, user);

      expect(result).toEqual(true);
    });
  });

  describe('get my feed', () => {
    it('내가 작성한 Feed를 조회한다.', async () => {
      const user = new User({ id: 'uuid_1', email: 'test@test.com' });
      const feed = new Feed({
        id: 'feed_uuid',
        content: 'test content',
        title: 'test title',
        user,
      });

      repository.getFeedByFeedIdAndUserId.mockResolvedValue(feed);
      const result = await service.getMyFeed(feed.id, user.id);

      expect(result.id).toEqual(feed.id);
      expect(result.user).toEqual(user);
    });

    it('Feed를 찾을 수 없는 경우 에러를 반환한다.', async () => {
      const user = new User({ id: 'uuid_1', email: 'test@test.com' });
      const feedId = 'feed_uuid';

      repository.getFeedByFeedIdAndUserId.mockResolvedValue(undefined);

      await expect(service.getMyFeed(feedId, user.id)).rejects.toEqual(
        expect.objectContaining({
          status: 404,
          response: {
            code: FEED_NOT_FOUND.code,
            message: FEED_NOT_FOUND.message,
          },
        }),
      );
    });
  });

  describe('get public feed', () => {
    it('공개된 Feed를 조회한다.', async () => {
      const user = new User({ id: 'user_uuid', email: 'test@test.com' });
      const feed = new Feed({
        id: 'feed_uuid',
        content: 'test content',
        title: 'test title',
        isPublic: true,
        user,
      });

      repository.getFeedByFeedIdAndIsPublic.mockResolvedValue(feed);
      const result = await service.getPublicFeed(feed.id);

      expect(result.id).toEqual(feed.id);
      expect(result.isPublic).toEqual(true);
    });

    it('feed의 isPublic이 false인 경우 에러를 반환한다.', async () => {
      const user = new User({ id: 'user_uuid', email: 'email@email.com' });
      const feed = new Feed({
        id: 'feed_uuid',
        content: 'test content',
        title: 'test title',
        isPublic: false,
        user,
      });

      repository.getFeedByFeedIdAndIsPublic.mockImplementation(async () => {
        if (feed.isPublic) {
          return feed;
        }
        return undefined;
      });

      await expect(service.getPublicFeed(feed.id)).rejects.toThrow(
        new NotFoundException(FEED_NOT_FOUND),
      );
    });
  });

  describe('increment view count', () => {
    it('Feed의 조회수를 증가시킨다.', async () => {
      const feed = new Feed({
        id: 'feed_uuid',
        title: 'test title',
        content: 'test content',
        viewCount: 0,
      });

      repository.getFeedByFeedIdAndIsPublic.mockResolvedValue(feed);
      repository.increment.mockResolvedValue(feed.id);

      const result = await service.incrementViewCount(feed.id);

      expect(result).toEqual(true);
    });

    it('Feed의 조회수를 증가시키려고 할 때 Feed를 찾을 수 없는 경우 NotFoundException을 반환한다.', async () => {
      repository.getFeedByFeedIdAndIsPublic.mockResolvedValue(undefined);
      repository.increment.mockResolvedValue(undefined);

      await expect(service.incrementViewCount(undefined)).rejects.toEqual(
        expect.objectContaining({
          status: 404,
          response: {
            code: FEED_NOT_FOUND.code,
            message: FEED_NOT_FOUND.message,
          },
        }),
      );
    });
  });

  describe('top ten feeds', () => {
    it('조회수가 높은 상위 10개의 Feed를 조회한다.', async () => {
      const viewCounts = Array.from(
        { length: 10 },
        (_, i) => (i + 1) * 10,
      ).sort(() => Math.random() - 0.5);

      const feeds = viewCounts.map((viewCount) => {
        return new Feed({
          id: faker.string.uuid(),
          title: faker.lorem.sentence(),
          content: faker.lorem.paragraph(),
          viewCount,
        });
      });

      repository.getTopTenFeedsAndSortViewCount.mockResolvedValue(
        feeds.sort((a, b) => b.viewCount - a.viewCount),
      );
      redisService.get.mockResolvedValue(JSON.stringify(feeds));
      redisService.set.mockResolvedValue(JSON.stringify(feeds));

      const result = await service.topTenFeeds();

      expect(result[0]).toEqual(feeds[0]);
    });
  });
});
