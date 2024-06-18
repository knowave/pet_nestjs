import { Test, TestingModule } from '@nestjs/testing';
import { FollowService } from './follow.service';
import { FollowRepository } from './repo/follow.repository';
import { UserRepository } from 'src/user/repo/user.repository';
import { User } from 'src/user/entities/user.entity';

const followMockRepository = () => ({
  save: jest.fn(),
  bulkSave: jest.fn(),
  getFollowers: jest.fn(),
  getFollowings: jest.fn(),
  getFollow: jest.fn(),
  softRemove: jest.fn(),
});

const userMockRepository = () => ({
  getUserByUsernameOrNickname: jest.fn(),
  followerIncrement: jest.fn(),
  followerDecrement: jest.fn(),
  followingIncrement: jest.fn(),
  followingDecrement: jest.fn(),
});

type FollowMockRepository<T = any> = Partial<
  Record<keyof FollowRepository, jest.Mock>
>;

type UserMockRepository<T = any> = Partial<
  Record<keyof UserRepository, jest.Mock>
>;

describe('FollowService', () => {
  let service: FollowService;
  let followRepository: FollowMockRepository<FollowRepository>;
  let userRepository: UserMockRepository<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowService,
        { provide: FollowRepository, useValue: followMockRepository() },
        { provide: UserRepository, useValue: userMockRepository() },
      ],
    }).compile();

    service = module.get<FollowService>(FollowService);
    followRepository =
      module.get<FollowMockRepository<FollowRepository>>(FollowRepository);
    userRepository =
      module.get<UserMockRepository<UserRepository>>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('follow', () => {
    it('서로 팔로우가 아닌 경우 팔로우를 추가되고, true를 반환한다.', async () => {
      const follower = new User({ id: 'uuid1', username: 'follower' });
      const following = { id: 'uuid2', username: 'following' };

      userRepository.getUserByUsernameOrNickname.mockResolvedValue(following);
      followRepository.getFollow.mockResolvedValue(null);

      const result = await service.follow(follower, following.username);
      expect(result).toBe(true);
    });

    it('서로 팔로우인 경우 팔로우를 삭제하고, false를 반환한다.', async () => {
      const follower = new User({ id: 'uuid1', username: 'follower' });
      const following = { id: 'uuid2', username: 'following' };

      userRepository.getUserByUsernameOrNickname.mockResolvedValue(following);
      followRepository.getFollow.mockResolvedValue({ id: 'uuid3' });

      const result = await service.follow(follower, following.username);
      expect(result).toBe(false);
    });
  });
});
