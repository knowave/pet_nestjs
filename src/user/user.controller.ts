import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  UploadedFile,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '../common/decorators/user.decorator';
import { User } from './entities/user.entity';
import { Public } from 'src/auth/is-public-decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    createUserDto.profileImage = {
      fileName: file.originalname,
      mimeType: file.mimetype,
      fileContent: file.buffer,
    };

    return await this.userService.createUser(createUserDto);
  }

  @Get('profile')
  async getUser(@CurrentUser() user: User) {
    return await this.userService.getUser(user.id);
  }

  @Patch()
  async update(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    updateUserDto.profileImage = {
      fileName: file.originalname,
      mimeType: file.mimetype,
      fileContent: file.buffer,
    };

    return await this.userService.updateUser(user.id, updateUserDto);
  }

  @Delete()
  async remove(@CurrentUser() user: User) {
    return await this.userService.deleteUser(user.id);
  }
}
