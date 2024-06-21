import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MysqlModule } from './database/mysql/mysql.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { FeedModule } from './feed/feed.module';
import { CommentModule } from './comment/comment.module';
import { FollowModule } from './follow/follow.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { PickModule } from './pick/pick.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MysqlModule,
    RedisModule,
    UserModule,
    AuthModule,
    FeedModule,
    CommentModule,
    FollowModule,
    PickModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: JwtAuthGuard }],
})
export class AppModule {}
