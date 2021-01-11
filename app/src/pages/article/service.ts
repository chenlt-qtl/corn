import { request } from 'umi';
import { TableListParams, ArticleListParams, ArticleItem } from './data.d';

export async function getArticleList(params?: ArticleListParams) {
  return request('/api/word/article/list', {
    params,
  });
}

export async function getSentenceByArticle(params: string) {
  return request('/api/word/sentence/listByArticle?articleId=' + params);
}

export async function getArticle(params: string) {
  return request('/api/word/article/queryById?id=' + params);
}

export async function removeArticle(params: string) {
  return request('/api/word/article/delete?id=' + params, { method: 'DELETE' });
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

export async function saveSentence(params: ArticleItem) {

  return request('/api/word/sentence/save', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateArticle(params: ArticleItem) {
  return request('/api/word/article/edit', {
    method: 'PUT',
    data: {
      ...params,
      method: 'put',
    },
  });
}

export async function getWordBySentence(params: string) {
  return request('/api/word/word/queryBySentence?id=' + params);
}

export async function getWordByArticle(params: string) {
  return request('/api/word/word/queryByArticle?id=' + params);
}

export async function queryByWordName(params: string) {
  return request('/api/word/word/queryByWordName?wordName=' + params);
}
