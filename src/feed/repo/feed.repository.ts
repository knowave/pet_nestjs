import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feed } from '../entities/feed.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FeedRepository {
  constructor(
    @InjectRepository(Feed) private readonly repository: Repository<Feed>,
  ) {}

  async save(feed: Feed): Promise<Feed> {
    return await this.repository.save(feed);
  }
}
