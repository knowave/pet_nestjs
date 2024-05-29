import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from '../entities/feed.entity';
import { FeedRepository } from './feed.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Feed])],
  providers: [FeedRepository],
  exports: [FeedRepository],
})
export class FeedRepositoryModule {}
