import { User } from 'src/user/entities/user.entity';

export class CreateCommentDto {
  user: User;
  content: string;
  feedId: string;
}
