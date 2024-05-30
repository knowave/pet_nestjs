import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { FollowRepositoryModule } from './repo/follow.repository.module';

@Module({
  imports: [FollowRepositoryModule],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
