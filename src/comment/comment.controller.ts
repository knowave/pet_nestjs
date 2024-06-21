import { Controller, Post, Body, Param, Get, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { IPage } from 'src/common/types/page';
import { PaginationEnum } from 'src/common/enums/pagination.enum';
import { Comment } from './entities/comment.entity';
import { Public } from 'src/auth/is-public-decorator';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/:feedId')
  async createComment(
    @Param('feedId') feedId: string,
    @Body('content') content: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.commentService.createComment(user, content, feedId);
  }

  @Get('/:feedId')
  @Public()
  async getCommentsByFeedId(
    @Param('feedId') feedId: string,
    @Query('page') page = 1,
    @Query('limit') limit?: number,
    @Query('sort') sort?: PaginationEnum,
  ): Promise<IPage<Comment>> {
    return await this.commentService.getCommentsByFeedId(
      { page, limit, sort },
      feedId,
    );
  }
}
