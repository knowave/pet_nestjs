import { OmitType } from '@nestjs/mapped-types';
import { User } from '../entities/user.entity';

export class CreateUserDto extends OmitType(User, [
  'token',
  'isDeleted',
  'feeds',
  'comments',
  'followers',
  'followings',
  'id',
  'createdAt',
  'deletedAt',
  'updatedAt',
]) {}
