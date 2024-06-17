import { PaginationEnum } from '../enums/pagination.enum';

export class PaginationDto {
  page?: number;
  limit?: number;
  sort?: PaginationEnum;
}
