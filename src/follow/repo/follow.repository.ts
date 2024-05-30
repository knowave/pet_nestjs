import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from '../entities/follow.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FollowRepository {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
  ) {}

  async save(follow: Follow): Promise<Follow> {
    return this.followRepository.save(follow);
  }

  async bulkSave(follows: Follow[]): Promise<Follow[]> {
    return this.followRepository.save(follows);
  }
}
