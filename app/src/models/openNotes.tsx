import { queryOpenHistory, addOpenHistory } from '@/pages/note_app/service'
import { NoteItem } from '@/pages/note_app/data.d';
import { Effect, Reducer } from 'umi';



export interface OpenNoteState {
    openedNotes: [NoteItem] | [];
}

export interface OpenNoteModelType {
    namespace: 'openNotes';
    state: OpenNoteState;
    effects: {
        queryOpenNote: Effect;
        updateOpenNotes: Effect;
        updateOpenNote: Effect;
    };
    reducers: {
        refreshOpenedNotes: Reducer<OpenNoteState>;
    };
}

const OpenNoteModel: OpenNoteModelType = {
    namespace: 'openNotes',

    state: {
        openedNotes: [],
    },

    effects: {
        *queryOpenNote({ payload }, { call, put }) {
            let result = yield call(queryOpenHistory);
            if (result) {
                if (result.success) {
                    // 成功
                    yield put({
                        type: 'refreshOpenedNotes',
                        payload: result.result
                    });
                }
                return result;
            }
        },
        *updateOpenNotes({ payload }, { call, put }) {
            let openedNotes = payload;
            if (openedNotes.length > 20) {
                openedNotes = openedNotes.splice(0, 20);
            }
            const openNoteIds = openedNotes.reduce((total: string[], item: NoteItem) => {
                total.push(item.id!);
                return total;
            }, []);

            yield put({
                type: 'refreshOpenedNotes',
                payload: openedNotes
            });
            let result = yield call(addOpenHistory, openNoteIds.join(','));
            return result;
        },
        *updateOpenNote({ payload }, { call, put, select }) {

            const openedNotes = yield select(state => state.openNotes.openedNotes);
            let newOpenedNotes = [];
            let exist = false;
            openedNotes.forEach((item: NoteItem) => {
                if (item.id == payload.id) {
                    newOpenedNotes.push(payload)
                    exist = true
                } else {
                    newOpenedNotes.push(item);
                }
            })
            if (!exist) {
                newOpenedNotes = [payload, ...newOpenedNotes]
            }

            if (newOpenedNotes.length > 20) {
                newOpenedNotes = newOpenedNotes.splice(0, 20);
            }
            const openNoteIds = newOpenedNotes.reduce((total: string[], item: NoteItem) => {
                total.push(item.id!);
                return total;
            }, []);

            yield put({
                type: 'refreshOpenedNotes',
                payload: newOpenedNotes
            });
            let result = yield call(addOpenHistory, openNoteIds.join(','));
            return result;
        },
    },
    reducers: {
        refreshOpenedNotes(state: OpenNoteState, { payload }) {
            return {
                ...state,
                openedNotes: payload,
            }
        },
    },
};


export default OpenNoteModel;
