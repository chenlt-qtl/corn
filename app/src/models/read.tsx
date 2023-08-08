import {  Reducer } from 'umi';

export interface ReadState {
    rate: number;
    articleId: number;
}

export interface ReadModelType {
    namespace: 'read';
    state: ReadState;
    reducers: {
        refreshRate: Reducer<ReadState>;
        refreshArticleId: Reducer<ReadState>;
    };
}

const ReadModel: ReadModelType = {
    namespace: 'read',

    state: {
        rate: 0.7,
        articleId: 0,
    },
    reducers: {
        refreshRate(state: ReadState, { payload }): ReadState {
            console.log(payload);
            
            return {
                ...state,
                rate: payload
            }
        },
        refreshArticleId(state: ReadState, { payload }): ReadState {
            return {
                ...state,
                articleId: payload
            }
        },
    },
};

export default ReadModel;


