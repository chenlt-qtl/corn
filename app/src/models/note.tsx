import { updateNoteTitle, queryNoteById, updateNoteText, updateParent, deleteNote, editOneFav, queryTreeMenu } from '@/services/note'
import { NoteItem, NoteNode } from '@/data/note';
import { Effect, Reducer } from 'umi';

export interface NoteState {
    openedNote: NoteItem;
    openedNotes: [];
    noteTreeData: NoteNode[];
    defaultTreeValue: string;
    listParentId: string;
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
        refreshDefaultTreeValue: Reducer<NoteState>;
        refreshListParentId: Reducer<NoteState>;
    };
}

const NoteModel: NoteModelType = {
    namespace: 'note',

    state: {
        openedNote: {},
        openedNotes: [],
        noteTreeData: [],
        defaultTreeValue: "",
        listParentId: "0"

    },

    effects: {

        *openNote({ payload }, { call, put, select }) {

            const { openedNotes, listParentId } = yield select(state => state.note);

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

            if (openedNotes.filter(i => i.id == note.id).length == 0) {
                yield put({
                    type: 'refreshOpenedNotes',
                    payload: [note, ...openedNotes]
                })
            }

            yield put({
                type: 'refreshOpenedNote',
                payload: note,
            })

            yield put({
                type: 'refreshDefaultTreeValue',
                payload: note.parentId||"0",
            })

            if (!listParentId) {
                yield put({
                    type: 'refreshListParentId',
                    payload: note.parentId,
                })
            }

        },
        * updateNoteTitle({ payload }, { call, put, select }) {
            const openedNotes = yield select(state => state.note.openedNotes);

            let result = yield call(updateNoteTitle, payload);
            if (result) {

                const newData = result.result;

                //更新打开历史数据  
                const newOpenedNotes = [...openedNotes]
                const note = newOpenedNotes.filter(i => i.id == note.id)
                if (note) {
                    note.name = newData.name;
                    yield put({
                        type: "refreshOpenedNotes",
                        payload: newOpenedNotes
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
                let newOpenedNotes = [...openedNotes].filter(i => i.id = payload);

                if (newOpenedNotes.length != openedNotes.length) {
                    yield put({
                        type: "refreshOpenedNotes",
                        payload: newOpenedNotes
                    });
                }

                if (openedNote.id == payload) {
                    yield put({
                        type: "openNote",
                        payload: {}
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
        *getNoteTree(_, { call, put }) {

            let res = yield call(queryTreeMenu, "0", true);
            if (res) {
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
        refreshDefaultTreeValue(state: NoteState, { payload }): NoteState {

            return {
                ...state,
                defaultTreeValue: String(payload || "")
            }
        },
        refreshListParentId(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                listParentId: String(payload || "")
            }
        },
    },
};

export default NoteModel;


