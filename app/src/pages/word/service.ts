import { request } from 'umi';


export async function getWordByArticle(params: string) {
  return request('/api/word/word/queryByArticle?id=' + params);
}

export async function queryByWordName(wordName: string, articleId: string) {
  return request('/api/word/word/queryByWordName?wordName=' + wordName + "&articleId=" + articleId);
}

