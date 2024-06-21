import { Controller, Post, Body, Param } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';

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
}
