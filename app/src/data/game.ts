export interface GameItem {
    id?: string;
    type?:number;
    gameName?: string;
    comment?: string;
    status?: number;
    updateTime?: Date;
    createTime?: Date;
    createBy?: string;
    addWordNames?: String[];
    removeWordNames?: String[];
}

export interface WordListParam {
    gameId?: string;
    pageNo?:number;
    pageSize?: number;
}