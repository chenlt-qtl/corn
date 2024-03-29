import request from '@/utils/request';
import { NoteItem } from './data.d';
import { decryptNote, encryptionNote } from '@/pages/note/utils';
import { decrypt } from '@/utils/utils';
import { NoteHistory } from '@/data/note';
import { stringify } from 'qs';

//树形数据结构
export async function queryTreeMenu(withLeaf: boolean) {
  return request('/api/note/queryTreeMenu?withLeaf=' + withLeaf).then(result => {
    if (result.success) {
      result.result = handleChildren(result.result);
      function handleChildren(notes) {//解密
        return notes.map(item => {
          item = decryptNote(item)
          if (item.children && item.children.length > 0) {
            item.children = handleChildren(item.children)
          }
          return item;
        })
      }
    }

    return result;
  })
}

export async function queryNoteById(id: string) {

  return request('/api/note/' + id).then((res) => {

    if (res) {
      res.result = decryptNote(res.result)
    }
    return res;
  })
}

export async function queryFav() {
  return request('/api/note/noteFavorite/queryNotes').then(res => {

    if (res) {
      res.result = res.result.map(item => decryptNote(item))
    }
    return res;
  })
}


/**
 * 搜索note
 * @param pageNo
 * @param pageSize 
 * @param searchStr 
 * @param withLeaf 
 * @returns 
 */
export async function pageSearchNote({ pageNo, pageSize, searchStr = "", parentId = "" }) {

  return request(`/api/note/pageSearchNote?pageNo=${pageNo}&pageSize=${pageSize}&searchStr=${searchStr}&parentId=${parentId}&withLeaf=true`).then(res => {
    if (res) {
      res.result = res.result.map(item => decryptNote(item))
    }
    return res;
  })
}

export async function updateNoteTitle(params: NoteItem) {
  return request('/api/note/updateTitle/' + params.id, {
    method: 'POST',
    data: {
      ...encryptionNote({ ...params }),
      method: 'post',
    },
  })
}

export async function addNote(params: NoteItem) {
  return request('/api/note/add', {
    method: 'POST',
    data: {
      ...encryptionNote({ ...params }),
      method: 'post',
    },
  }).then(res => {
    if (res) {
      res.result = decryptNote(res.result)
    }
    return res;
  })
}

export async function updateNoteText(params: NoteItem) {
  return request('/api/note/updateText/' + params.id, {
    method: 'POST',
    data: {
      ...encryptionNote(params),
      method: 'post',
    },
  })
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
  return request('/api/note/' + id, {
    method: 'DELETE',
    data: {
      method: 'delete',
    },
  });
}

export async function uploadImg(img: String, id: number) {

  return request('/api/sys/common/uploadImg/note/' + id, {
    method: 'POST',
    data: {
      file: img,
    },
  });
}


export async function updateParent(noteId: number, parentId: number) {

  return request('/api/note/updateParent/' + noteId + "?parentId=" + parentId, {
    method: 'PUT'
  }).then(res => {

    if (res) {
      res.result = decryptNote(res.result)
    }
    return res;
  })
}




export async function getHistorys(params) {
  console.log(stringify(params));
  

  return request('/api/noteHistory?' + stringify(params)).then(res => {
    if (res) {
      res.result.records = res.result.records.map(item => decryptNote(item))
    }
    return res;
  })
}


export async function getHistory(id: number) {

  return request('/api/noteHistory/' + id).then(res => {
    if (res) {
      res.result.text = decrypt(res.result.text);
    }
    return res;
  })
}

export async function addNoteHistory(params: NoteHistory) {
  return request('/api/noteHistory', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  })
}