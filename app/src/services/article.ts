import request from '@/utils/request';
import { stringify } from 'qs';

import { ArticleListParams, ArticleItem, ArticleWordRelItem } from "@/data/word"

export async function getArticleList(params: ArticleListParams) {
    return request('/api/word/article/list', {
        params,
    });
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

export async function updateArticle(params: ArticleItem) {
    return request('/api/word/article/edit', {
        method: 'PUT',
        data: {
            ...params,
            method: 'put',
        },
    });
}


export async function getWordByArticle(params: string) {
    return request('/api/word/word/queryByArticle?id=' + params);
}


export async function addWordUserRel(params: string) {
    return request('/api/word/wordUser/add?wordId=' + params, { method: 'POST' });
}

export async function removeWordUserRel(params: string) {
    return request('/api/word/wordUser/delete?wordId=' + params, { method: 'DELETE' });
}

export async function addArticleWordRel(params: ArticleWordRelItem) {
    return request('/api/word/articleWordRel/add', { method: 'POST', data: params });
}

export async function removeArticleWordRel(params: ArticleWordRelItem) {
    return request('/api/word/articleWordRel/delete?wordId=' + params.wordId + '&articleId=' + params.articleId, { method: 'DELETE' });
}

export async function getSentenceByArticle(params: object) {
    return request('/api/word/sentence/listByArticle?' + stringify(params));
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

export async function removeSentence(params: string) {
    return request('/api/word/sentence/delete?id=' + params, { method: 'DELETE' });
}
