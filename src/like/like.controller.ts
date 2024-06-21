import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LikeService } from './like.service';
import { CreatePickDto } from './dto/create-pick.dto';
import { UpdatePickDto } from './dto/update-pick.dto';

@Controller('pick')
export class LikeController {
  constructor(private readonly pickService: LikeService) {}

  @Post()
  create(@Body() createPickDto: CreatePickDto) {
    return this.pickService.create(createPickDto);
  }

  @Get()
  findAll() {
    return this.pickService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pickService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePickDto: UpdatePickDto) {
    return this.pickService.update(+id, updatePickDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pickService.remove(+id);
  }
}
