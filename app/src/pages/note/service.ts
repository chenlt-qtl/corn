import { request } from 'umi';
import { NoteListParams, ArticleItem, NoteItem } from './data.d';

//树形数据结构
export async function queryTreeList(params: NoteListParams) {
  return request('/api/note/queryTreeList', {
    params
  });
}

export async function queryNoteById(id: string) {
  return request('/api/note/queryById?id=' + id);
}

export async function queryNote(parentId: string) {
  return request('/api/note/listNote?parentId=' + parentId);
}


export async function modifyNote(params: NoteItem) {
  return request('/api/note/edit', {
    method: 'PUT',
    data: {
      ...params,
      method: 'put',
    },
  });
}

export async function addNote(params: NoteItem) {
  return request('/api/note/add', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
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

export async function queryOpenHistory() {
  return request('/api/note/openHistory/query');
}

export async function addOpenHistory(openNoteIds: String) {
  return request('/api/note/openHistory/add', {
    method: 'POST',
    data: {
      openNoteIds,
      method: 'post',
    },
  });
}