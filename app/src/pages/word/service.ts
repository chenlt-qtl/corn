import { request } from 'umi';
import { stringify } from 'qs';

export async function getWordByArticle(params: string) {
  return request('/api/word/word/queryByArticle?id=' + params);
}

export async function queryByWordName(wordName: string, articleId: string) {
  return request('/api/word/word/queryByWordName?wordName=' + wordName + "&articleId=" + articleId);
}


export async function getFolderList(params:object) {
  return request('/api/folder?'+stringify(params));
}