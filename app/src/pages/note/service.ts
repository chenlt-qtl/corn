import { request } from 'umi';
import { NoteItem } from './data.d';
import { stringify } from 'qs';


//树形数据结构
export async function queryTreeMenu(id: string) {
  return request('/api/note/queryTreeMenu?parentId=' + id);
}

export async function queryNoteById(id: string) {
  return request('/api/note/queryById?id=' + id);
}

export async function queryNote(parentId: string) {
  return request('/api/note/listNote?parentId=' + parentId);
}


export async function searchNote(params) {

  return request(`/api/note/searchNote?${stringify(params)}`);
}

export async function getNewest(pageNo: number, pageSize: number) {
  return request('/api/note/queryNewest?pageNo=' + pageNo + "&pageSize=" + pageSize);
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

export async function editAllFav(noteIds: String) {
  return request('/api/note/noteFavorite/edit', {
    method: 'PUT',
    data: {
      noteIds,
      method: 'put',
    },
  });
}

export async function editOneFav({ noteId, isFav }) {
  return request('/api/note/noteFavorite/edit/' + noteId + "?isFav=" + isFav, {
    method: 'PUT',
    data: {
      method: 'put',
    },
  });
}

export async function deleteNote(id: String) {
  return request('/api/note/delete?id=' + id, {
    method: 'DELETE',
    data: {
      method: 'delete',
    },
  });
}

export async function uploadImg(img: String) {

  return request('/api/sys/common/uploadImg/note', {
    method: 'POST',
    data: {
      file: img,
    },
  });
}


export async function updateParent(noteId: string, parentId: string) {

  return request('/api/note/updateParent', {
    method: 'PUT',
    data: {
      id: noteId,
      parentId
    }
  });
}