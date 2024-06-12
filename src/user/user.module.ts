import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepositoryModule } from './repo/user.repository.module';
import { S3Module } from 'src/s3/s3.module';

@Module({
  imports: [UserRepositoryModule, S3Module],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
