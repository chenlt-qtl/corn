export interface ArticleItem {
  id?: string;
  title?: string;
  mp3?: string;
  comment?: string;
  picture?: string;
  status?: number;
  updateTime?: Date;
  createTime?: Date;
  createBy?: string;
  sentences?: SentenceItem[];
}

export interface SentenceItem {
  id?: string;
  articleId?: string;
  content?: string;
  idx?: number;
  mp3?: string;
  comment?: string;
  picture?: string;
  status?: number;
  updateTime?: Date;
  createTime?: Date;
  createBy?: string;
  words?:WordItem[]
}

export interface WordItem {
  id?: string;
  wordName?: string;
  mp3?: string;
  phAm?: string;
  exchange?: string;
  parts?: string;
  phAnMp3?: string;
  status?: number;
  updateTime?: Date;
  createTime?: Date;
  createBy?: string;
  updateBy?: string;
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
