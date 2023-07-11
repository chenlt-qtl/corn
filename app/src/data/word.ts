
export interface ArticleListParams {
    title?: string;
    type: number;
    pageSize?: number;
    pageNo?: number;
}


export interface ArticleItem {
    id?: string;
    type:number;
    title?: string;
    mp3?: string;
    comment?: string;
    picture?: string;
    status?: number;
    updateTime?: Date;
    createTime?: Date;
    createBy?: string;
    addWordNames?: String[];
    removeWordNames?: String[];
}

export interface ArticleWordRelItem {
    wordId: string;
    articleId: string;
}

export interface SentenceItem {
    id?: string;
    articleId?: string;
    content?: string;
    idx?: number;
    mp3?: string;
    mp3Time?: string;
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

  export interface WordCnItem {
    id?: string;
    wordName?: string;
    pinYin?: string;
    biHuaShu?: number;
    buShou?: string;
    jieGou?: string;
    biShun?: string;
    acceptation?:string;
    shortAcce?:string;
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