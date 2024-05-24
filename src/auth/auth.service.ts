import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { INVALID_AUTH_ERROR } from './error/auth.error';
import { JwtService } from '@nestjs/jwt';
import {
  JWT_ACCESS_TOKEN_EXPIRATION_TIME,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESH_TOKEN_EXPIRATION_TIME,
  JWT_REFRESH_TOKEN_SECRET,
} from 'src/common/env';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, plainTextPassword: string): Promise<any> {
    const user = await this.userService.getUserByEmailForValidation(email);
    await this.verifyPassword(plainTextPassword, user.password);

    delete user.password;
    return user;
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.userService.getUserByEmailForValidation(
      loginDto.email,
    );
    const result = await this.validateUser(loginDto.email, loginDto.password);

    if (!result) throw new BadRequestException(INVALID_AUTH_ERROR);

    const accessToken = this.createAccessToken(user.id);
    const refreshToken = this.createRefreshToken(user.id);

    await this.userService.setCurrentRefreshToken(refreshToken, user.id);
    return { accessToken, refreshToken };
  }

  private createAccessToken(id: string) {
    const payload = { id };

    return this.jwtService.sign(payload, {
      secret: JWT_ACCESS_TOKEN_SECRET,
      expiresIn: JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    });
  }

  private createRefreshToken(id: string) {
    const payload = { id };
    return this.jwtService.sign(payload, {
      secret: JWT_REFRESH_TOKEN_SECRET,
      expiresIn: JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });
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
