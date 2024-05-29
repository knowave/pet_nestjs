import { Test, TestingModule } from '@nestjs/testing';
import { FeedService } from './feed.service';
import { FeedRepository } from './repo/feed.repository';
import { User } from 'src/user/entities/user.entity';
import { CreateFeedDto } from './dto/create-feed.dto';
import { Feed } from './entities/feed.entity';
import { FEED_NOT_FOUND } from './error/feed.error';
import { NotFoundException } from '@nestjs/common';

const mockRepository = () => ({
  save: jest.fn(),
  getFeedByFeedIdAndUserId: jest.fn(),
  getFeedByFeedIdAndIsPublic: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof FeedRepository, jest.Mock>>;

describe('FeedService', () => {
  let service: FeedService;
  let repository: MockRepository<FeedRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedService,
        {
          provide: FeedRepository,
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<FeedService>(FeedService);
    repository = module.get<MockRepository<FeedRepository>>(FeedRepository);
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
});
