import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepositoryModule } from './repo/user.repository.module';

@Module({
  imports: [UserRepositoryModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
