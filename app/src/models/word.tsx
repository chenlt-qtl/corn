import { getWordByArticle, queryByWordName } from '@/pages/word/service'
import {addWordUserRel, removeWordUserRel, addArticleWordRel, removeArticleWordRel} from "@/services/article"

import { WordItem } from '@/data/word';
import { Effect, Reducer } from 'umi';


export interface WordState {
    wordMap: Map;
    words: WordItem[];
    wordNames: string[];
}

export interface WordModelType {
    namespace: 'word';
    state: WordState;
    effects: {
        getWordByArticle: Effect;
        getWordByWordName: Effect;
        getSentenceByWord: Effect;
        addWordUserRel: Effect;
        removeWordUserRel: Effect;
        addArticleWordRel: Effect;
        removeArticleWordRel: Effect;

    };
    reducers: {
        refreshWordMap: Reducer<WordState>;
    };
}

const WordModel: WordModelType = {
    namespace: 'word',
    state: {
        wordMap: new Map(),
        words: [],
        wordNames: []
    },

    effects: {
        *getWordByArticle({ payload }, { call, put }) {
            let result = yield call(getWordByArticle, payload);
            if (result) {
                if (result.success && result.result) {
                    // 成功
                    yield put({
                        type: 'refreshWordMap',
                        payload: result.result.records,
                    });
                    yield put({
                        type: 'refreshWords',
                        payload: result.result.records,
                    });
                }
                return result;
            }
        },

        *getWordByWordName({ payload }, { call, put, select }) {
            const { wordName, articleId } = payload;
            let result = yield call(queryByWordName, wordName, articleId);
            if (result) {
                if (result.success && result.result) {
                    // 成功
                    yield put({
                        type: 'refreshWordMap',
                        payload: [result.result],
                    });
                    return result.result;
                }

            }
        },
        *addWordUserRel({ payload }, { call, put }) {
            let result = yield call(addWordUserRel, payload.wordId);
            if (result) {
                if (result) {
                    yield put({
                        type: 'getWordByArticle',
                        payload: payload.articleId,
                    });
                    return result;
                }
            }
        },
        *removeWordUserRel({ payload }, { call, put }) {
            let result = yield call(removeWordUserRel, payload.wordId);
            if (result) {
                if (result) {
                    yield put({
                        type: 'getWordByArticle',
                        payload: payload.articleId,
                    });
                    return result;
                }
            }
        },
        *addArticleWordRel({ payload }, { call, put }) {
            let result = yield call(addArticleWordRel, payload);
            if (result) {
                yield put({
                    type: 'getWordByArticle',
                    payload: payload.articleId,
                });
                return result;
            }
        },
        *removeArticleWordRel({ payload }, { call, put }) {
            let result = yield call(removeArticleWordRel, payload);
            if (result) {
                yield put({
                    type: 'getWordByArticle',
                    payload: payload.articleId,
                });
                return result;
            }
        }

    },
    reducers: {
        refreshWordMap(state: WordState, { payload }): WordState {
            const newWords = new Map(state.wordMap);
            payload.forEach((item: WordItem) => newWords.set(item.wordName, item));
            return {
                ...state,
                wordMap: newWords,
            }
        },
        refreshWords(state: WordState, { payload }): WordState {
            const wordNames = [];
            payload.forEach((item: WordItem) => wordNames.push(item.wordName));
            return {
                ...state,
                words: payload,
                wordNames
            }
        },
    },
};

export default WordModel;