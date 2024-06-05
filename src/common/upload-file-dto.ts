import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UploadFileDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsString()
  fileName: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  @IsString()
  mimeType: string;

  @ApiProperty({ type: 'buffer', format: 'binary' })
  @IsOptional()
  fileContent: Buffer;
}
