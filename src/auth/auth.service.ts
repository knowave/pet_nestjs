import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { INVALID_AUTH_ERROR } from './error/auth.error';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(email: string, plainTextPassword: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);
    await this.verifyPassword(plainTextPassword, user.password);

    delete user.password;
    return user;
  }

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatch = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!isPasswordMatch) {
      throw new BadRequestException(INVALID_AUTH_ERROR);
    }
  }
}
