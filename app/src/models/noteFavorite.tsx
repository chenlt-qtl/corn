import { queryFavorite, editFavorite } from '@/pages/note/service'
import { Effect, Reducer } from 'umi';
import { NoteItem } from '@/pages/note/data.d';


export interface NoteFavoriteState {
    notes: [NoteItem] | [];
    noteIds: [string] | [];
}

export interface NoteFavoriteModelType {
    namespace: 'noteFavorite';
    state: NoteFavoriteState;
    effects: {
        query: Effect;
        edit: Effect;
    };
    reducers: {
        refreshNoteFavorite: Reducer<NoteFavoriteState>;
        refreshNoteIds: Reducer<NoteFavoriteState>;
    };
}

const noteFavoriteModel: NoteFavoriteModelType = {
    namespace: 'noteFavorite',

    state: {
        notes: [],
        noteIds: [],
    },

    effects: {
        *query(_, { call, put }) {
            let result = yield call(queryFavorite);
            if (result) {
                if (result.success && result.result) {
                    // 成功
                    yield put({
                        type: 'refreshNoteFavorite',
                        payload: result.result
                    });
                }
                return result;
            }
        },
        *edit({ payload }, { call, put }) {
            yield put({//先修改id数据
                type: 'refreshNoteIds',payload
            });
            let result = yield call(editFavorite, payload.join(','));//修改数据库
            if(result&&result.success){//刷新收藏夹数据
                yield put({
                    type: 'query'
                }); 
            }
            return result;
        },
    },
    reducers: {
        refreshNoteFavorite(state: NoteFavoriteState, { payload }) {
            let noteIds = [];
            if(payload&&payload.length>0){
                noteIds = payload.map(item=>item.id);
            }
            return {
                ...state,
                notes: payload,
                noteIds
            }
        },
        refreshNoteIds(state: NoteFavoriteState, { payload }) {
            return {
                ...state,
                noteIds:payload
            }
        },
    },
};


export default noteFavoriteModel;
