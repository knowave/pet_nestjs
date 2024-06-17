import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FeedService } from './feed.service';
import { CreateFeedDto } from './dto/create-feed.dto';
import { UpdateFeedDto } from './dto/update-feed.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Feed } from './entities/feed.entity';
import { Public } from 'src/auth/is-public-decorator';
import { IPage } from 'src/common/types/page';
import { PaginationEnum } from 'src/common/enums/pagination.enum';

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

  @Get()
  @Public()
  async getPublicFeeds(
    @Query('page') page: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: PaginationEnum,
  ): Promise<IPage<Feed>> {
    return await this.feedService.getPublicFeeds({ page, limit, sort });
  }

  @Get('/my/feed-list')
  async getMyFeeds(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @CurrentUser() user: User,
  ): Promise<IPage<Feed>> {
    return await this.feedService.getMyFeeds({ page, limit }, user.id);
  }

  @Post('/:feedId/view')
  @Public()
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
  @Public()
  async getPublicFeed(@Param('feedId') feedId: string): Promise<Feed> {
    return await this.feedService.getPublicFeed(feedId);
  }

  @Get('/top-ten')
  @Public()
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
