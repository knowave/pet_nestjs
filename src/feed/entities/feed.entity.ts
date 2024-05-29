import { IsNotEmpty } from 'class-validator';
import { Comment } from 'src/comment/entities/comment.entity';
import { BaseEntity } from 'src/common/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Feed extends BaseEntity {
  @Column({ type: 'varchar', length: 50, comment: 'Feed 제목' })
  @IsNotEmpty({ message: '제목을 입력해주세요' })
  title: string;

  @Column({ type: 'text', comment: 'Feed 썸네일', nullable: true })
  thumbnail?: string;

  @Column({ type: 'text', comment: 'Feed 글' })
  @IsNotEmpty({ message: '내용을 입력해주세요' })
  content: string;

  @Column({ type: 'boolean', default: true, comment: '공개 여부' })
  isPublic: boolean;

  @ManyToOne(() => User, (user) => user.feeds, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.feed, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  comments: Comment[];
}
