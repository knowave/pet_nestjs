import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { FollowRepositoryModule } from './repo/follow.repository.module';
import { UserRepositoryModule } from 'src/user/repo/user.repository.module';

@Module({
  imports: [FollowRepositoryModule, UserRepositoryModule],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
