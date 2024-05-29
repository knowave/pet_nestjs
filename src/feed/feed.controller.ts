import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { CurrentUser } from 'src/user/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Feed } from './entities/feed.entity';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  async createFeed(
    @Body() createFeedDto: CreateFeedDto,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.feedService.createFeed(createFeedDto, user);
  }

  @Get('/my/:feedId')
  async getMyFeed(
    @Param('feedId') feedId: string,
    @CurrentUser() user: User,
  ): Promise<Feed> {
    return await this.feedService.getMyFeed(feedId, user.id);
  }

  @Get('/:feedId')
  async getPublicFeed(@Param('feedId') feedId: string): Promise<Feed> {
    return await this.feedService.getPublicFeed(feedId);
  }

  @Get()
  findAll() {
    return this.feedService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFeedDto: UpdateFeedDto) {
    return this.feedService.update(+id, updateFeedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.feedService.remove(+id);
  }
}
