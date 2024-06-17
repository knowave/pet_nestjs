import { Body, Controller, Post } from '@nestjs/common';
import { FollowService } from './follow.service';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  async follow(
    @CurrentUser() user: User,
    @Body('name') name: string,
  ): Promise<boolean> {
    return await this.followService.follow(user, name);
  }
}
