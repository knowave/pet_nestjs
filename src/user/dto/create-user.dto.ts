import { PickType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';
import { UploadFileDto } from 'src/common/upload-file-dto';

export class CreateUserDto extends PickType(User, [
  'email',
  'username',
  'nickname',
  'phoneNumber',
  'introduction',
]) {
  profileImage: UploadFileDto;
}
