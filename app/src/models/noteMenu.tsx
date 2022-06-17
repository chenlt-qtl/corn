import { Reducer } from 'umi';
import { NoteItem } from '@/data/note';

export interface NoteState {

    listParentNote: NoteItem,
    activeMenuId: string;

}

export interface NoteModelType {
    namespace: 'noteMenu';
    state: NoteState;
    effects: {
        queryListParentNote: Effect;

    }
    reducers: {
        refreshListParentNote: Reducer<NoteState>;
        refreshActiveMenuId: Reducer<NoteState>;
    };
}

const NoteModel: NoteModelType = {
    namespace: 'noteMenu',
    state: {
        listParentNote: {},
        activeMenuId: "",
    },

    effects: {

        *queryListParentNote({ payload }, { call, put }) {

            let result = yield call(queryNoteById, payload);
            if (result) {
                if (result.success) {
                    yield put({
                        type: 'refreshListParentNote',
                        payload: result.result,
                    })
                }
            }
        },
    },
    reducers: {
        refreshListParentNote(state: NoteState, { payload }): NoteState {

            const note = payload || { id: 0, name: '所有笔记' };
            return {
                ...state,
                listParentNote: note,
            }
        },
    },
};

export default NoteModel;