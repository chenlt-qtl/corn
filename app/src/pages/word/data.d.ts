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
  addWordNames?:String[];
  removeWordNames?:String[];
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
}

export interface WordItem {
  id?: string;
  wordName?: string;
  mp3?: string;
  phAm?: string;
  exchange?: string;
  acceptation?:string;
  parts?: string;
  phAnMp3?: string;
  wordUserRel?:WordUserItem;
  icibaSentences?:[IcibaSentenceItem]
  sentences?:[SentenceItem]
  status?: number;
  updateTime?: Date;
  createTime?: Date;
  createBy?: string;
  updateBy?: string;
}

interface WordUserItem {
  wordId:string;
  user:string;
  familiarity:number;
}

export interface IcibaSentenceItem {
  id:string;
  orig:string;
  trans:string;
}

export interface ArticleListParams {
  title?: string;
  pageSize?: number;
  currentPage?: number;
}


