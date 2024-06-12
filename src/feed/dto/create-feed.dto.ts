import { PickType } from '@nestjs/mapped-types';
import { Feed } from '../entities/feed.entity';
import { UploadFileDto } from 'src/common/upload-file-dto';

export class CreateFeedDto extends PickType(Feed, [
  'content',
  'title',
  'isPublic',
]) {
  thumbnail: UploadFileDto;
}
