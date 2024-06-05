import { PickType } from '@nestjs/mapped-types';
import { Feed } from '../entities/feed.entity';

export class UpdateFeedDto extends PickType(Feed, [
  'content',
  'title',
  'thumbnail',
  'isPublic',
]) {}
