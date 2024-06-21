import { Controller, Post, Param, Get, Query } from '@nestjs/common';
import { LikeService } from './like.service';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { IPage } from 'src/common/types/page';
import { Like } from './entities/like.entity';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('/feed/:feedId')
  async feedLike(
    @Param('feedId') feedId: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.likeService.feedLike(feedId, user);
  }

  @Post('/comment/:commentId')
  async commentLike(
    @Param('commentId') commentId: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.likeService.commentLike(commentId, user);
  }

  @Get('/my')
  async getMyLikeFeed(
    @Query('page') page = 1,
    @Query('limit') limit: number,
    @CurrentUser() user: User,
  ): Promise<IPage<Like>> {
    return await this.likeService.getMyLikeFeed({ page, limit }, user.id);
  }
}
