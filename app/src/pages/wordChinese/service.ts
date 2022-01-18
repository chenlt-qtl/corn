import { request } from 'umi';


export async function getWordByArticle(params: string) {
  return request('/api/wordChinese/queryByArticle?id=' + params);
}

export async function queryByWordName(wordName: string, articleId: string) {
  return request('/api/wordChinese/queryByWordName?wordName=' + wordName + "&articleId=" + articleId);
}



