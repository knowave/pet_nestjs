import { Injectable, NotFoundException } from '@nestjs/common';
import { FollowRepository } from './repo/follow.repository';
import { UserRepository } from 'src/user/repo/user.repository';
import { NOT_FOUND_USER } from 'src/user/error/user.error';
import { Follow } from './entities/follow.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FollowService {
  constructor(
    private readonly followRepository: FollowRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async follow(follower: User, name: string): Promise<boolean> {
    const following = await this.userRepository.getUserByUsernameOrNickname(
      name,
    );

    if (!following) throw new NotFoundException(NOT_FOUND_USER);

    const isFollow = await this.followRepository.getFollow(
      follower.id,
      following.id,
    );

    if (isFollow) {
      await this.followRepository.softRemove(isFollow);
      return false;
    } else {
      await this.followRepository.save(
        new Follow({
          follower,
          following,
        }),
      );
      return true;
    }
  }
}
