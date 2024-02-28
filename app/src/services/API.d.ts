declare namespace API {
  export interface CurrentUser {
    avatar?: string;
    name?: string;
    title?: string;
    group?: string;
    signature?: string;
    tags?: {
      key: string;
      label: string;
    }[];
    userid?: string;
    access?: 'user' | 'guest' | 'admin';
    unreadCount?: number;
  }

  export interface LoginStateType {
    success?: boolean;
    result?:{userInfo:object,token:string}
  }

  export interface NoticeIconData {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  }

  export interface SysData {
    id: string;
    name: string;
    code: string;
    value: string;
  }

  export interface CardNum {
    id?: string;
    userId?: number;
    title?: string;
    value?: number;
  }

  export interface CardData {
    tabs: string[];
    value: string[];
  }

  export interface Recipe {
    id: number;
    name: string;
    recipeRelVoList:object[]
  }

  export interface Ingredient {
    id: number;
    name: string;
    expirationDate:number;
    status:number;
  }

  export interface RecipeRel {
    id?: number;
    recipeId: number;
    ingredientId:number;
    amount:string;
  }
  
}
