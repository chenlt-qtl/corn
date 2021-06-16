import { request } from 'umi';
import { NoteItem } from './data.d';

//树形数据结构
export async function queryTreeList(id:string) {
  return request('/api/note/queryTreeList?parentId='+id);
}

export async function queryNoteById(id: string) {
  return request('/api/note/queryById?id=' + id);
}

export async function queryNote(parentId: string) {
  return request('/api/note/listNote?parentId=' + parentId);
}

export async function updateNoteTitle(params: NoteItem) {
  return request('/api/note/updateTitle', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateNoteText(params: NoteItem) {
  return request('/api/note/updateText', {
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

export async function queryFavorite() {
  return request('/api/note/noteFavorite/queryNotes');
}

export async function editFavorite(noteIds: String) {
  return request('/api/note/noteFavorite/edit', {
    method: 'PUT',
    data: {
      noteIds,
      method: 'put',
    },
  });
}

export async function deleteNote(id: String) {
  return request('/api/note/delete?id='+id, {
    method: 'DELETE',
    data: {
      method: 'delete',
    },
  });
}

export async function uploadImg(img: String) {
  console.log(234234);
  
  return request('/api/sys/common/uploadImg/note', {
    method: 'POST',
    data: {
      file:img,
    },
  });
}