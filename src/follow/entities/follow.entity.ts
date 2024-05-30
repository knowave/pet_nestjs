import { BaseEntity } from 'src/common/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Entity, ManyToOne } from 'typeorm';

@Entity()
export class Follow extends BaseEntity {
  @ManyToOne(() => User, (user) => user.followers, {
    eager: true,
    onDelete: 'CASCADE',
  })
  follower: User;

  @ManyToOne(() => User, (user) => user.followings, {
    eager: true,
    onDelete: 'CASCADE',
  })
  following: User;
}
