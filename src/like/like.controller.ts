import { Controller, Post, Param } from '@nestjs/common';
import { LikeService } from './like.service';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('pick')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('/:feedId')
  async feedLike(
    @Param('feedId') feedId: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.likeService.feedLike(feedId, user);
  }

  @Post('/:commentId')
  async commentLike(
    @Param('commentId') commentId: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.likeService.commentLike(commentId, user);
  }
}
