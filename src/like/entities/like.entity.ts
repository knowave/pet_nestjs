import { Comment } from 'src/comment/entities/comment.entity';
import { BaseEntity } from 'src/common/base.entity';
import { Feed } from 'src/feed/entities/feed.entity';
import { User } from 'src/user/entities/user.entity';
import { ManyToOne } from 'typeorm';

export class Like extends BaseEntity {
  @ManyToOne(() => User, (user) => user.likes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Feed, (feed) => feed.likes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  feed: Feed;

  @ManyToOne(() => Comment, (comment) => comment.likes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  comment: Comment;
}
