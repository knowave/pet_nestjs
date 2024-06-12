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
import { SALT_ROUNDS } from 'src/common/env';
import { S3Service } from 'src/s3/s3.service';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly s3Service: S3Service,
  ) {}

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

    let profileImageUrl: string;

    const existUser = await this.userRepository.getUserByEmail(email);

    if (existUser) throw new BadRequestException(ALREADY_EXIST_USER);

    const hashedPassword = await this.hashPassword(password);

    if (profileImage) {
      const { fileName, mimeType, fileContent } = profileImage;
      const newFileName = `${uuid()}-${fileName}`;

      const uploadFile = await this.s3Service.uploadObject(
        newFileName,
        fileContent,
        mimeType,
      );

      profileImageUrl = uploadFile.Key;
    }

    const createdUser = await this.userRepository.save(
      new User({
        email,
        username,
        nickname,
        password: hashedPassword,
        phoneNumber,
        profileImage: profileImageUrl,
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

    if (profileImage) {
      if (user.profileImage) {
        const url = user.profileImage.split('/');
        const fileName = url.slice(-1)[0];
        await this.s3Service.deleteObject(fileName);
      }

      const { fileName, mimeType, fileContent } = profileImage;
      const newFileName = `${uuid()}-${fileName}`;

      const uploadFile = await this.s3Service.uploadObject(
        newFileName,
        fileContent,
        mimeType,
      );

      user.profileImage = uploadFile.Key;
    }

    user.email = email || user.email;
    user.username = username || user.username;
    user.nickname = nickname || user.nickname;
    user.phoneNumber = phoneNumber || user.phoneNumber;
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

  async setCurrentRefreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<User> {
    const user = await this.getUser(userId);
    user.token = refreshToken;
    return await this.userRepository.save(user);
  }

  async removeRefreshToken(userId: string) {
    const user = await this.getUser(userId);

    user.token = null;
    return await this.userRepository.save(user);
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }
}
