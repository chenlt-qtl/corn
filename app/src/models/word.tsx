import { getWordByArticle, queryByWordName, querySentenceByWord } from '@/pages/article/service'
import { WordItem } from '@/pages/article/data.d';
import { Effect, Reducer } from 'umi';


export interface WordState {
    wordMap: Map
}

export interface WordModelType {
    namespace: 'word';
    state: WordState;
    effects: {
        getWordByArticle: Effect;
        getWordByWordName: Effect;
        getWordFromDb: Effect;
        getSentenceByWord: Effect;
    };
    reducers: {
        refreshWordMap: Reducer<WordState>;
    };
}

const WordModel: WordModelType = {
    namespace: 'word',
    state: {
        wordMap: new Map()
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
                }
                return result;
            }
        },

        *getWordByWordName({ payload }, { call, put, select }) {
            const wordMap = yield select(state => state.word.wordMap);
            const word = wordMap.get(payload);
            if (word) {
                return word;
            } else {
                //后台获取
                yield put({
                    type: 'getWordFromDb',
                    payload: payload,
                });
                return wordMap.get(payload);

            }
        },
        *getWordFromDb({ payload }, { call, put, select }) {
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
    },
};

export default WordModel;