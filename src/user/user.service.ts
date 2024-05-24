import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './repo/user.repository';
import { ALREADY_EXIST_USER } from './error/user.error';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email, username, nickname, password, profileImage, introduction } =
      createUserDto;

    const existUser = await this.userRepository.getUserByEmail(email);

    if (existUser) throw new BadRequestException(ALREADY_EXIST_USER);

    const hashedPassword = await this.hashPassword(password);
    return await this.userRepository.save(
      new User({
        email,
        username,
        nickname,
        password: hashedPassword,
        profileImage,
        introduction,
      }),
    );
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
