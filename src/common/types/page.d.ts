interface PageInfo {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
}

export interface IPage<T> {
  data: T[];
  totalCount: number;
  pageInfo: PageInfo;
}
