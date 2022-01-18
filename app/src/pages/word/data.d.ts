export interface WordItem {
  id?: string;
  wordName?: string;
  mp3?: string;
  phAm?: string;
  exchange?: string;
  acceptation?:string;
  parts?: string;
  phAnMp3?: string;
  relWithUser?:boolean;
  relWithArticle?:boolean;
  icibaSentences?:[IcibaSentenceItem]
  sentences?:[SentenceItem]
  status?: number;
  updateTime?: Date;
  createTime?: Date;
  createBy?: string;
  updateBy?: string;
}

export interface IcibaSentenceItem {
  id:string;
  orig:string;
  trans:string;
}




