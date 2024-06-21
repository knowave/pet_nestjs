import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from '../entities/like.entity';
import { LikeRepository } from './like.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Like])],
  providers: [LikeRepository],
  exports: [LikeRepository],
})
export class LikeRepositoryModule {}
