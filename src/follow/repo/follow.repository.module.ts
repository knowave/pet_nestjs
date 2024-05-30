import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follow } from '../entities/follow.entity';
import { FollowRepository } from './follow.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Follow])],
  providers: [FollowRepository],
  exports: [FollowRepository],
})
export class FollowRepositoryModule {}
