import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';
import { CurrentUser } from 'src/user/user.decorator';
import { LoginResponseDto } from './dto/login-response.dto';
import { UserService } from 'src/user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@CurrentUser() user: User): Promise<LoginResponseDto> {
    const accessToken = this.authService.createAccessToken(user.id);
    const refreshToken = this.authService.createRefreshToken(user.id);

    await this.userService.setCurrentRefreshToken(refreshToken, user.id);

    return { accessToken, refreshToken };
  }
}
