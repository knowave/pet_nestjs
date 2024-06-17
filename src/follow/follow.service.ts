import { Injectable, NotFoundException } from '@nestjs/common';
import { FollowRepository } from './repo/follow.repository';
import { UserRepository } from 'src/user/repo/user.repository';
import { NOT_FOUND_USER } from 'src/user/error/user.error';
import { Follow } from './entities/follow.entity';
import { User } from 'src/user/entities/user.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { IPage } from 'src/common/types/page';

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
      await this.userRepository.followerDecrement(following.id);
      await this.userRepository.followingDecrement(follower.id);
      await this.followRepository.softRemove(isFollow);
      return false;
    } else {
      await this.userRepository.followerIncrement(following.id);
      await this.userRepository.followingIncrement(follower.id);
      await this.followRepository.save(
        new Follow({
          follower,
          following,
        }),
      );
      return true;
    }
  }

  async getFollowers(
    paginationDto: PaginationDto,
    userId: string,
  ): Promise<IPage<User>> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const followers = await this.followRepository.getFollowersByUserId(userId);

    const followerUsers = followers
      .map((follower) => follower.follower)
      .filter((follower) => follower !== null);
    const paginationFollowers = followerUsers.slice(skip, skip + limit) || [];

    return {
      data: paginationFollowers,
      totalCount: followerUsers.length,
      pageInfo: {
        currentPage: page,
        totalPages: Math.ceil(followerUsers.length / limit),
        hasNextPage: skip + limit < followerUsers.length,
      },
    };
  }
}
