import { ApiProperty } from '@nestjs/swagger';

export class GetMyFeedsDto {
  @ApiProperty({ example: 'uuid', description: 'User Id' })
  userId: string;

  @ApiProperty({ example: '1', description: 'Page' })
  page?: number;

  @ApiProperty({ example: '10', description: 'Limit' })
  limit?: number;
}
