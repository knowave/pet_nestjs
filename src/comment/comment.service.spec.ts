import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { FeedRepository } from 'src/feed/repo/feed.repository';
import { CommentRepository } from './repo/comment.repository';

const feedMockRepository = () => ({
  getFeedByFeedIdAndIsPublic: jest.fn(),
});

const commentMockRepository = () => ({
  save: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof T, jest.Mock>>;

describe('CommentService', () => {
  let service: CommentService;
  let feedRepository: MockRepository<FeedRepository>;
  let commentRepository: MockRepository<CommentRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
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

    service = module.get<CommentService>(CommentService);
    feedRepository = module.get<MockRepository<FeedRepository>>(FeedRepository);
    commentRepository =
      module.get<MockRepository<CommentRepository>>(CommentRepository);
  });

  describe('createComment', () => {
    it('feed가 존재하면 comment를 생성하고 true를 반환한다.', async () => {
      const user = { id: 'uuid1', username: 'username' };
      const feedId = 'uuid2';
      const comment = 'comment';

      feedRepository.getFeedByFeedIdAndIsPublic.mockResolvedValue({
        feedId,
      });
      commentRepository.save.mockResolvedValue(comment);
    });
  });
});
