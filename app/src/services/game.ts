import request from '@/utils/request';
import { stringify } from 'qs';

import { GameItem, WordListParam } from "@/data/game"

export async function getGameList() {
    return request('/api/game/game/list');
}

export async function addGame(params: GameItem) {

    return request('/api/game/game/add', {
        method: 'POST',
        data: {
            ...params,
            method: 'post',
        },
    });
}

export async function updateGame(params: GameItem) {
    return request('/api/game/game/edit', {
        method: 'PUT',
        data: {
            ...params,
            method: 'put',
        },
    });
}

export async function getEnWordByGame(params: WordListParam) {
    return request('/api/word/word/listByGame?' + stringify(params));
}

export async function getCnWordByGame(params: WordListParam) {
    return request('/api/wordChinese/listByGame?' + stringify(params));
}


export async function relWithWords({ id, articleIds }) {

    return request('/api/game/gameWordRel/add/' + id + "?articleIds=" + articleIds.join(","), {
        method: 'POST',
        data: {
            method: 'post',
        },
    });
}

export async function getGameLevelInfo(gameId:string) {
    return request('/api/game/game/level?gameId=' + gameId);
}

export async function getEnWordByGameLevel(gameId:string) {
    return request('/api/word/word/listByGameLevel/'+gameId);
}

export async function getCnWordByGameLevel(gameId:string) {
    return request('/api/wordChinese/listByGameLevel/'+gameId);
}