import { request } from 'umi';
import { TableListParams, NoteListParams,ArticleItem,NoteItem } from './data.d';

//树形数据结构
export async function queryTreeList(params:NoteListParams) {
  return request('/api/note/queryTreeList', {
    params
  });
}

export async function queryNoteById(id:string) {
  return request('/api/note/queryById?id='+id);
}

export async function queryNote(parentId:string) {
  return request('/api/note/listNote?parentId='+parentId);
}

export async function removeRule(params: { key: number[] }) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addArticle(params: ArticleItem) {
  return request('/api/word/article/add', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params: TableListParams) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}
