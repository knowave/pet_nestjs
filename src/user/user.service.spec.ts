import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './repo/user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const mockRepository = () => ({
  save: jest.fn(),
  getUserByEmail: jest.fn(),
  getUserById: jest.fn(),
  softRemove: jest.fn(),
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

  describe('get user', () => {
    it('should get a user', async () => {
      const userId = 'testUUID';
      const user: CreateUserDto = {
        email: 'test@test.com',
        username: 'test',
        nickname: 'test',
        password: 'test1234!',
        phoneNumber: '010-1234-5678',
        introduction: 'tester',
      };

      repository.getUserById.mockResolvedValue(user);
      const result = await service.getUser(userId);
      expect(result).toEqual(user);
    });

    it('should throw an error if the user does not exist', async () => {
      const userId = 'testUUID';
      repository.getUserById.mockResolvedValue(null);
      await expect(service.getUser(userId)).rejects.toThrow();
    });
  });

  describe('update user', () => {
    it('should update a user', async () => {
      const userId = 'testUUID1';
      const updateUser: UpdateUserDto = {
        email: 'test123@test.com',
      };

      repository.getUserById.mockResolvedValue({ id: userId });
      const result = await service.updateUser(userId, updateUser);
      expect(result).toEqual(true);
    });

    it('should throw an error if the user does not exist', async () => {
      const userId = 'testUUID1';
      const updateUser: UpdateUserDto = {
        email: 'test1@test.com',
      };

      repository.getUserById.mockResolvedValue(null);
      await expect(service.updateUser(userId, updateUser)).rejects.toThrow();
    });
  });

  describe('delete user', () => {
    it('should delete a user', async () => {
      const userId = 'test';

      repository.getUserById.mockResolvedValue({ id: userId });
      repository.softRemove.mockResolvedValue({ id: userId });
      const result = await service.deleteUser(userId);
      expect(result).toEqual(true);
    });

    it('should throw an error if the user does not exist', async () => {
      const userId = 'test';

      repository.getUserById.mockResolvedValue(null);
      await expect(service.deleteUser(userId)).rejects.toThrow();
    });
  });
});
