import request from '@/utils/request';
import { NoteItem } from './data.d';
import { stringify } from 'qs';
import { encryption, decrypt } from '@/utils/utils'
import { decryptNote, encryptionNote } from '@/pages/note/utils';


//树形数据结构
export async function queryTreeMenu(id: string, withLeaf: boolean) {
  return request('/api/note/queryTreeMenu?parentId=' + id + "&withLeaf=" + withLeaf).then(result => {
    if (result.success) {
      handleChildren(result.result);
      function handleChildren(notes) {//解密
        return notes.map(item => {

          item.name = decrypt(item.name);
          item.title = decrypt(item.title);
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

  return request('/api/note/queryById?id=' + id).then((res) => {

    if (res) {
      res.result = decryptNote(res.result)
    }
    return res;
  })
}

export async function queryNote({ parentId = 0, isLeaf }) {
  
  return request('/api/note/listNote?parentId=' + parentId + (isLeaf?"&isLeaf=" + isLeaf:"")).then(res => {

    if (res) {
      res.result = res.result.map(item => decryptNote(item))
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
      res.result.records = res.result.records.map(item => decryptNote(item))
    }
    return res;
  })
}

export async function getNewest(pageNo: number, pageSize: number) {
  return request('/api/note/queryNewest?pageNo=' + pageNo + "&pageSize=" + pageSize).then(res => {
    if (res) {
      res.result.records = res.result.records.map(item => decryptNote(item))
    }
    return res;
  })
}

export async function updateNoteTitle(params: NoteItem) {
  return request('/api/note/updateTitle', {
    method: 'POST',
    data: {
      ...encryptionNote({ ...params }),
      method: 'post',
    },
  }).then(res => {
    if (res) {
      res.result = decryptNote(res.result);
    }
    return res;
  });
}

export async function updateNoteText(params: NoteItem) {
  return request('/api/note/updateText', {
    method: 'POST',
    data: {
      ...encryptionNote(params),
      method: 'post',
    },
  }).then(res => {
    if (res) {
      res.result = decryptNote(res.result);
    }
    return res;
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
  }).then(res => {

    if (res) {
      res.result = decryptNote(res.result)
    }
    return res;
  })
}