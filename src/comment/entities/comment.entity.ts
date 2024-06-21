import { IsNotEmpty } from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { Feed } from 'src/feed/entities/feed.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Like } from 'src/like/entities/like.entity';

@Entity()
export class Comment extends BaseEntity {
  @Column({ type: 'text', comment: '댓글 내용' })
  @IsNotEmpty({ message: '내용을 입력해주세요' })
  content: string;

  @Column({ type: 'int', default: 0, comment: '좋아요 수' })
  likeCount: number;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Feed, (feed) => feed.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  feed: Feed;

  @OneToMany(() => Like, (like) => like.comment, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  likes: Like[];
}
