import { Test, TestingModule } from '@nestjs/testing';
import { FollowService } from './follow.service';
import { FollowRepository } from './repo/follow.repository';

const followMockRepository = () => ({
  save: jest.fn(),
  bulkSave: jest.fn(),
  getFollowers: jest.fn(),
  getFollowings: jest.fn(),
});

type FollowMockRepository<T = any> = Partial<
  Record<keyof FollowRepository, jest.Mock>
>;

describe('FollowService', () => {
  let service: FollowService;
  let followRepository: FollowMockRepository<FollowRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowService,
        { provide: FollowRepository, useValue: followMockRepository },
      ],
    }).compile();

    service = module.get<FollowService>(FollowService);
    followRepository =
      module.get<FollowMockRepository<FollowRepository>>(FollowRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
