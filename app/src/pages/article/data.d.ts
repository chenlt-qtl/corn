export interface ArticleItem {
  id: string;
  title:string;
  mp3?: string;
  picture?: string;
  status?: number;
  updateTime?: Date;
  createTime?: Date;
  createBy?: string;
}

export interface ArticleListParams {
  title?: string;
  pageSize?: number;
  currentPage?: number;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter?: string;
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
}
