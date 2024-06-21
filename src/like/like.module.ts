import { Module } from '@nestjs/common';
import { LikeService as LikeService } from './like.service';
import { LikeController } from './like.controller';
import { LikeRepositoryModule } from './repo/like.repository.module';

@Module({
  imports: [LikeRepositoryModule],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
