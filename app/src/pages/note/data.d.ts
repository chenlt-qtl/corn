export interface NoteItem {
  id: string;
  title:string;
  text?: string;
  parentId:string;
  parentIds:string;
  status?: number;
  updateTime?: Date;
  createTime?: Date;
  createBy?: string;
}

export interface NoteListParams {
  parentId: string;
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
