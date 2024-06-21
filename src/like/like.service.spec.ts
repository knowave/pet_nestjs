import { Test, TestingModule } from '@nestjs/testing';
import { LikeService } from './like.service';
import { LikeRepository } from './repo/like.repository';
import { FeedRepository } from 'src/feed/repo/feed.repository';
import { Feed } from 'src/feed/entities/feed.entity';
import { User } from 'src/user/entities/user.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { CommentRepository } from 'src/comment/repo/comment.repository';

const likeMockRepository = () => ({
  save: jest.fn(),
  softRemove: jest.fn(),
  getLikeByFeedIdAndUserId: jest.fn(),
  getLikeByCommentIdAndUserId: jest.fn(),
});

const feedMockRepository = () => ({
  getFeedById: jest.fn(),
});

const commentMockRepository = () => ({
  getCommentById: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof T, jest.Mock>>;

describe('LikeService', () => {
  let service: LikeService;
  let likeRepository: MockRepository<LikeRepository>;
  let feedRepository: MockRepository<FeedRepository>;
  let commentRepository: MockRepository<CommentRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikeService,
        {
          provide: LikeRepository,
          useValue: likeMockRepository(),
        },
        {
          provide: FeedRepository,
          useValue: feedMockRepository(),
        },
        {
          provide: CommentRepository,
          useValue: commentMockRepository(),
        },
      ],
    }).compile();

    service = module.get<LikeService>(LikeService);
    likeRepository = module.get<MockRepository<LikeRepository>>(LikeRepository);
    feedRepository = module.get<MockRepository<FeedRepository>>(FeedRepository);
    commentRepository =
      module.get<MockRepository<CommentRepository>>(CommentRepository);
  });

  describe('feedLike', () => {
    it('feed가 존재하고, 해당 user가 이미 feed를 좋아요를 누르지 않은 경우 true를 반환한다.', async () => {
      const feed = new Feed({
        id: 'feedId',
        content: 'content',
      });
      const user = new User({
        id: 'userId',
        username: 'username',
      });

      feedRepository.getFeedById.mockResolvedValue(feed);
      likeRepository.getLikeByFeedIdAndUserId.mockResolvedValue(null);

      const result = await service.feedLike(feed.id, user);

      expect(result).toBe(true);
    });

    it('feed가 존재하고, 해당 user가 이미 feed를 좋아요를 눌렀을 경우 false를 반환한다.', async () => {
      const feed = new Feed({
        id: 'feedId',
        content: 'content',
      });
      const user = new User({
        id: 'userId',
        username: 'username',
      });

      feedRepository.getFeedById.mockResolvedValue(feed);
      likeRepository.getLikeByFeedIdAndUserId.mockResolvedValue({ feed, user });

      const result = await service.feedLike(feed.id, user);

      expect(result).toBe(false);
    });
  });

  describe('commentLike', () => {
    it('comment가 존재하고, 해당 user가 이미 comment를 좋아요를 누르지 않은 경우 true를 반환한다.', async () => {
      const comment = new Comment({
        id: 'commentId',
        content: 'content',
      });
      const user = new User({
        id: 'userId',
        username: 'username',
      });

      commentRepository.getCommentById.mockResolvedValue(comment);
      likeRepository.getLikeByCommentIdAndUserId.mockResolvedValue(null);

      const result = await service.commentLike(comment.id, user);

      expect(result).toBe(true);
    });

    it('comment가 존재하고, 해당 user가 이미 comment를 좋아요를 눌렀을 경우 false를 반환한다.', async () => {
      const comment = new Comment({
        id: 'commentId',
        content: 'content',
      });
      const user = new User({
        id: 'userId',
        username: 'username',
      });

      commentRepository.getCommentById.mockResolvedValue(comment);
      likeRepository.getLikeByCommentIdAndUserId.mockResolvedValue({
        comment,
        user,
      });

      const result = await service.commentLike(comment.id, user);

      expect(result).toBe(false);
    });
  });
});
