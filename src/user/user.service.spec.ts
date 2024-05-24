import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './repo/user.repository';
import { CreateUserDto } from './dto/create-user.dto';

const mockRepository = () => ({
  save: jest.fn(),
  getUserByEmail: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof UserRepository, jest.Mock>>;

describe('UserService', () => {
  let service: UserService;
  let repository: MockRepository<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockRepository(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<MockRepository<UserRepository>>(UserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create user', () => {
    it('should create a user', async () => {
      const createUser: CreateUserDto = {
        email: 'test@test.com',
        username: 'test',
        nickname: 'test',
        password: 'test1234!',
        phoneNumber: '010-1234-5678',
        introduction: 'tester',
      };

      repository.save.mockResolvedValue(createUser);
      const result = await service.createUser(createUser);
      expect(result).toEqual(createUser);
    });

    it('should throw an error if the user already exists', async () => {
      const createUser: CreateUserDto = {
        email: 'test@test.com',
        username: 'test',
        nickname: 'test',
        password: 'test1234!',
        phoneNumber: '010-1234-5678',
        introduction: 'tester',
      };

      repository.getUserByEmail.mockResolvedValue(createUser);
      await expect(service.createUser(createUser)).rejects.toThrow();
    });
  });
});
