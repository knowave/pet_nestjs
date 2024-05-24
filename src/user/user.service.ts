import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repo/user.repository';
import { ALREADY_EXIST_USER, NOT_FOUND_USER } from './error/user.error';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const {
      email,
      username,
      nickname,
      password,
      phoneNumber,
      profileImage,
      introduction,
    } = createUserDto;

    const existUser = await this.userRepository.getUserByEmail(email);

    if (existUser) throw new BadRequestException(ALREADY_EXIST_USER);

    const hashedPassword = await this.hashPassword(password);

    const createdUser = await this.userRepository.save(
      new User({
        email,
        username,
        nickname,
        password: hashedPassword,
        phoneNumber,
        profileImage,
        introduction,
      }),
    );

    delete createdUser.password;
    delete createdUser.token;
    return createdUser;
  }

  async getUser(userId: string): Promise<User> {
    const user = await this.userRepository.getUserById(userId);

    if (!user) throw new NotFoundException(NOT_FOUND_USER);

    return user;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<boolean> {
    const {
      email,
      username,
      nickname,
      phoneNumber,
      profileImage,
      introduction,
    } = updateUserDto;
    const user = await this.getUser(userId);

    user.email = email || user.email;
    user.username = username || user.username;
    user.nickname = nickname || user.nickname;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.profileImage = profileImage || user.profileImage;
    user.introduction = introduction || user.introduction;

    return true;
  }

  async deleteUser(userId: string): Promise<boolean> {
    const user = await this.getUser(userId);

    await this.userRepository.softRemove(user);
    return true;
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    const user = await this.getUser(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.token,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.getUserByEmail(email);

    if (!user) throw new NotFoundException(NOT_FOUND_USER);

    return user;
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
