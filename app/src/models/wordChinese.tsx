import { getWordByArticle, queryByWordName } from '@/pages/wordChinese/service'

import { WordItem } from '@/pages/article/data.d';
import { Effect, Reducer } from 'umi';


export interface WordState {
    wordMap: Map;
    words: WordItem[];
    wordNames: string[];
}

export interface WordModelType {
    namespace: 'wordChinese';
    state: WordState;
    effects: {
        getWordByArticle: Effect;
        getWordByWordName: Effect;
    };
    reducers: {
        refreshWordMap: Reducer<WordState>;
        refreshWords: Reducer<WordState>;
    };
}

const WordModel: WordModelType = {
    namespace: 'wordChinese',
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