import { Module } from '@nestjs/common';
import { LikeService as LikeService } from './like.service';
import { LikeController } from './like.controller';

@Module({
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
