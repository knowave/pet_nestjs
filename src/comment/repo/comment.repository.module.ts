import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../entities/comment.entity';
import { CommentRepository } from './comment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  providers: [CommentRepository],
  exports: [CommentRepository],
})
export class CommentRepositoryModule {}
