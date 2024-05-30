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
}
