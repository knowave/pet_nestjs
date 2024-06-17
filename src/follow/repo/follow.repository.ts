import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from '../entities/follow.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FollowRepository {
  constructor(
    @InjectRepository(Follow)
    private readonly repository: Repository<Follow>,
  ) {}

  async save(follow: Follow): Promise<Follow> {
    return await this.repository.save(follow);
  }

  async bulkSave(follows: Follow[]): Promise<Follow[]> {
    return await this.repository.save(follows);
  }

  async getFollowers(followingId: number): Promise<Follow[]> {
    return await this.repository
      .createQueryBuilder('follow')
      .innerJoinAndSelect('follow.follower', 'follower')
      .innerJoinAndSelect('follower.user', 'user')
      .where('follow.followingId = :followingId', { followingId })
      .getMany();
  }

  async getFollowings(followerId: number): Promise<Follow[]> {
    return await this.repository
      .createQueryBuilder('follow')
      .innerJoinAndSelect('follow.following', 'following')
      .innerJoinAndSelect('following.user', 'user')
      .where('follow.followerId = :followerId', { followerId })
      .getMany();
  }

  async getFollow(followerId: string, followingId: string): Promise<Follow> {
    return await this.repository
      .createQueryBuilder('follow')
      .where('follow.followerId = :followerId', { followerId })
      .andWhere('follow.followingId = :followingId', { followingId })
      .getOne();
  }

  async softRemove(follow: Follow): Promise<Follow> {
    return await this.repository.softRemove(follow);
  }

  async getFollowersByUserId(userId: string): Promise<Follow[]> {
    return await this.repository
      .createQueryBuilder('follow')
      .innerJoin('follow.follower', 'follower')
      .select([
        'follower.id',
        'follower.username',
        'follower.nickname',
        'follower.profileImage',
      ])
      .where('follow.followingId = :userId', { userId })
      .getMany();
  }
}
