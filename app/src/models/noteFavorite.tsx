import { queryFavorite, editAllFav, editOneFav, queryNoteById } from '@/pages/note/service'
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
        editOne: Effect;
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
                type: 'refreshNoteIds', payload
            });
            let result = yield call(editAllFav, payload.join(','));//修改数据库
            if (result && result.success) {//刷新收藏夹数据
                yield put({
                    type: 'query'
                });
            }
            return result;
        },
        *editOne({ payload }, { call, put, select }) {

            let result = yield call(editOneFav, payload);
            if (result) {

                //更新打开的数据
                let res = yield call(queryNoteById, payload.noteId);

                if (res) {
                    if (res.success) {
                        const openedNotes = yield select(state => state.note.openedNotes);
                        const note = res.result;
                        // 成功
                        yield put({
                            type: 'note/refreshOpenedNotes',
                            payload: openedNotes.map(item=>item.id==payload.noteId?note:item)
                        })

                        yield put({
                            type: 'note/refreshOpenedNote',
                            payload: note
                        });

                    }

                }

                //更新收藏夹
                const listParentNote = yield select(state => state.noteMenu.listParentNote);

                if(listParentNote.id=="fav"){
                    yield put({
                        type: 'noteMenu/refreshListParentNote',
                        payload: {...listParentNote}
                    });

                }


            }
            return result;
        },
    },
    reducers: {
        refreshNoteFavorite(state: NoteFavoriteState, { payload }) {
            let noteIds = [];
            if (payload && payload.length > 0) {
                noteIds = payload.map(item => item.id);
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
                noteIds: payload
            }
        },
    },
};


export default noteFavoriteModel;
