import { getWordByArticle, queryByWordName, querySentenceByWord } from '@/pages/article/service'
import { WordItem } from '@/pages/article/data.d';
import { Effect, Reducer } from 'umi';


export interface WordState {
    wordMap: Map;
    words: WordItem[];
    wordNames:string[];
}

export interface WordModelType {
    namespace: 'word';
    state: WordState;
    effects: {
        getWordByArticle: Effect;
        getWordByWordName: Effect;
        getSentenceByWord: Effect;
    };
    reducers: {
        refreshWordMap: Reducer<WordState>;
    };
}

const WordModel: WordModelType = {
    namespace: 'word',
    state: {
        wordMap: new Map(),
        words:[],
        wordNames:[]
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
            let result = yield call(queryByWordName, payload);
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
        *getSentenceByWord({ payload }, { call, put, select }) {
            let result = yield call(querySentenceByWord, payload);
            if (result) {
                if (result.success && result.result) {
                    // 成功
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