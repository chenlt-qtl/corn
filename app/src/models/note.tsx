import { updateNoteTitle, queryNoteById, updateNoteText, updateParent, deleteNote, editOneFav,queryTreeMenu } from '@/services/note'
import { NoteItem,NoteNode } from '@/data/note';
import { Effect, Reducer } from 'umi';

export interface NoteState {
    openedNote: NoteItem;
    openedNotes: object;
    noteTreeData:NoteNode[]
}

export interface NoteModelType {
    namespace: 'note';
    state: NoteState;
    effects: {
        openNote: Effect;
        updateNoteTitle: Effect;
        updateNoteText: Effect;
        deleteNote: Effect;
        updateParent: Effect;
        editFav: Effect;
        getNoteTree: Effect;
    };
    reducers: {
        refreshOpenedNote: Reducer<NoteState>;
        refreshOpenedNotes: Reducer<NoteState>;
        refreshNoteTreeData: Reducer<NoteState>;
    };
}

const NoteModel: NoteModelType = {
    namespace: 'note',

    state: {
        openedNote: {},
        openedNotes: {},
    },

    effects: {

        *openNote({ payload }, { call, put, select }) {

            const openedNotes = yield select(state => state.note.openedNotes);

            let note;
            if (payload == "add") {
                note = { id: "new", name: "新文档" }
            } else {
                let result = yield call(queryNoteById, payload);
                if (result) {
                    if (result.success) {
                        note = result.result;
                    }
                }
            }

            yield put({
                type: 'refreshOpenedNotes',
                payload: { ...openedNotes, [note.id]: note }
            })

            yield put({
                type: 'refreshOpenedNote',
                payload: note,
            })

        },
        * updateNoteTitle({ payload }, { call, put, select }) {
            const openedNotes = yield select(state => state.note.openedNotes);

            let result = yield call(updateNoteTitle, payload);
            if (result) {

                const newData = result.result;

                //更新tab数据  
                if (openedNotes[newData.id]) {
                    yield put({
                        type: "refreshOpenedNotes",
                        payload: { ...openedNotes, [newData.id]: newData }
                    });
                }
                //刷新openedNote
                yield put({
                    type: 'refreshOpenedNote',
                    payload: newData,
                })

                return result;
            }
        },
        * updateNoteText({ payload }, { call, put, select }) {
            let result = yield call(updateNoteText, payload);
            if (result) {
                const newData = result.result;
                //刷新openedNote
                yield put({
                    type: 'refreshOpenedNote',
                    payload: newData,
                })

                return result;
            }
        },
        * deleteNote({ payload }, { call, put, select }) {
            const openedNotes = yield select(state => state.note.openedNotes);
            const openedNote = yield select(state => state.note.openedNote);
            let result = yield call(deleteNote, payload);
            if (result) {
                let newOpenedNotes = { ...openedNotes };

                delete newOpenedNotes[payload];

                if (newOpenedNotes.length != openedNotes.length) {
                    yield put({
                        type: "refreshOpenedNotes",
                        payload: newOpenedNotes
                    });
                }

                if (openedNote.id == payload) {
                    yield put({
                        type: "refreshOpenedNote",
                        payload: Object.values(newOpenedNotes)[0] || {}
                    });
                }

                return result;
            }
        },
        * updateParent({ payload }, { call, put, select }) {

            const { id, parentId } = payload;

            const openedNote = yield select(state => state.note.openedNote);

            let result = yield call(updateParent, id, parentId);
            if (result) {
                const note = result.result;
                if (openedNote.id == id) {
                    yield put({
                        type: "refreshOpenedNote",
                        payload: note
                    });
                }
            }
            return result;
        },
        * editFav({ payload }, { call, put, select }) {

            let result = yield call(editOneFav, payload);
            if (result) {

                //更新打开的数据
                let res = yield call(queryNoteById, payload.noteId);

                if (res) {
                    if (res.success) {
                        const note = res.result;
                        // 成功
                        yield put({
                            type: 'refreshOpenedNote',
                            payload: note
                        })
                    }
                }
                return result;
            }
        },
        *getNoteTree(_,{call,put}){
            
            let res = yield call(queryTreeMenu, "0",true);
            if(res){
                if (res.success) {
                    // 成功
                    yield put({
                        type: 'refreshNoteTreeData',
                        payload: res.result
                    })
                }
            }
            return res;
        }
    },
    reducers: {
        refreshOpenedNote(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                openedNote: payload
            }
        },
        refreshOpenedNotes(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                openedNotes: payload
            }
        },
        refreshNoteTreeData(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                noteTreeData: payload
            }
        },
    },
};

export default NoteModel;


