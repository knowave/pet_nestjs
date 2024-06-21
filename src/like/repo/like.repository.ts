import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from '../entities/like.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LikeRepository {
  constructor(
    @InjectRepository(Like) private readonly repository: Repository<Like>,
  ) {}

  async save(like: Like): Promise<Like> {
    return await this.repository.save(like);
  }

  async softRemove(like: Like): Promise<void> {
    await this.repository.softRemove(like);
  }

  async getLikeByFeedIdAndUserId(
    feedId: string,
    userId: string,
  ): Promise<Like> {
    return await this.repository
      .createQueryBuilder('like')
      .where('like.feedId = :feedId', { feedId })
      .andWhere('like.userId = :userId', { userId })
      .getOne();
  }
}
