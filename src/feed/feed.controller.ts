import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Feed } from './entities/feed.entity';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post()
  async createFeed(
    @Body() createFeedDto: CreateFeedDto,
    @UploadedFile() thumbnail: Express.Multer.File,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    createFeedDto.thumbnail = {
      fileName: thumbnail.originalname,
      mimeType: thumbnail.mimetype,
      fileContent: thumbnail.buffer,
    };
    return await this.feedService.createFeed(createFeedDto, user);
  }

  @Post('/:feedId/view')
  async incrementViewCount(@Param('feedId') feedId: string): Promise<boolean> {
    return await this.feedService.incrementViewCount(feedId);
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

  @Get('/top-ten')
  async topTenFeeds(): Promise<Feed[]> {
    return await this.feedService.topTenFeeds();
  }

  @Patch('/:feedId')
  async updateFeed(
    @Param('feedId') feedId: string,
    @UploadedFile() thumbnail: Express.Multer.File,
    @Body() updateFeedDto: UpdateFeedDto,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    updateFeedDto.thumbnail = {
      fileName: thumbnail.originalname,
      mimeType: thumbnail.mimetype,
      fileContent: thumbnail.buffer,
    };

    return await this.feedService.updateFeed(feedId, updateFeedDto, user.id);
  }

  @Delete('/:feedId')
  async removeFeed(
    @Param('feedId') feedId: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.feedService.removeFeed(feedId, user.id);
  }
}
