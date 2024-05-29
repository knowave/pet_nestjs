import { PickType } from '@nestjs/mapped-types';
import { Feed } from '../entities/feed.entity';

export class CreateFeedDto extends PickType(Feed, [
  'content',
  'thumbnail',
  'title',
]) {}
