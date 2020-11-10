import { request } from 'umi';
import { TableListParams, ArticleListParams,ArticleItem } from './data.d';

export async function getList(params?: ArticleListParams) {
  return request('/api/word/article/list', {
    params,
  });
}

export async function queryRule(params?: TableListParams) {
  return request('/api/rule', {
    params,
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
