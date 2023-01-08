import { updateNoteTitle, queryNoteById, updateNoteText, updateParent, deleteNote, editOneFav } from '@/services/note'
import { NoteItem } from '@/data/note';
import { Effect, Reducer } from 'umi';

export interface NoteState {
    openedNote: NoteItem;
    openedNotes: object;
    showMenu: boolean;
    listParam: object;
    treeParam: object;
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
    };
    reducers: {
        refreshOpenedNote: Reducer<NoteState>;
        refreshOpenedNotes: Reducer<NoteState>;
        refreshShowMenu: Reducer<NoteState>;
        refreshListParam: Reducer<NoteState>;
        refreshTreeParam: Reducer<NoteState>;
    };
}

const NoteModel: NoteModelType = {
    namespace: 'note',

    state: {
        openedNote: {},
        openedNotes: {},
        showMenu: true,
        listParam: { parentId: "0", isLeaf: 1 },
        treeParam: { parentId: "0" },
    },

    effects: {

        *openNote({ payload }, { call, put, select }) {

            const openedNotes = yield select(state => state.note.openedNotes);

            let note = openedNotes[payload];

            if (!note) {
                let result = yield call(queryNoteById, payload);
                if (result) {
                    if (result.success) {
                        note = result.result;

                        // 成功
                        yield put({
                            type: 'refreshOpenedNotes',
                            payload: { ...openedNotes, [note.id]: note }
                        })

                    }
                }
            }

            yield put({
                type: 'refreshOpenedNote',
                payload: note,
            })

        },
        *updateNoteTitle({ payload }, { call, put, select }) {
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


                return result;
            }
        },
        *updateNoteText({ payload }, { call, put, select }) {
            const openedNotes = yield select(state => state.note.openedNotes);
            let result = yield call(updateNoteText, payload);
            if (result) {
                const newData = result.result;
                //更新tab数据
                if (openedNotes[newData.id]) {
                    yield put({
                        type: "refreshOpenedNotes",
                        payload: { ...openedNotes, [newData.id]: newData }
                    });
                }

                return result;
            }
        },
        *deleteNote({ payload }, { call, put, select }) {
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
        *updateParent({ payload }, { call, put, select }) {

            const { id, parentId } = payload;

            const openedNotes = yield select(state => state.note.openedNotes);
            const openedNote = yield select(state => state.note.openedNote);

            let result = yield call(updateParent, id, parentId);
            if (result) {
                const note = result.result;
                if (openedNotes[id]) {
                    const { parentId, parentIds } = note;
                    const newNote = { ...openedNotes[id], parentId, parentIds }

                    yield put({
                        type: "refreshOpenedNotes",
                        payload: { ...openedNotes, [id]: newNote }
                    });

                    if (openedNote.id == id) {
                        yield put({
                            type: "refreshOpenedNote",
                            payload: newNote
                        });
                    }
                }

                yield put({
                    type: "refreshTreeParam",
                    payload: {}
                })

            }
            return result;
        },
        *editFav({ payload }, { call, put, select }) {

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
                            type: 'refreshOpenedNotes',
                            payload: { ...openedNotes, [note.id]: note }
                        })
                    }

                }
                return result;
            }
        },
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
        refreshShowMenu(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                showMenu: payload
            }
        },
        refreshListParam(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                listParam: payload
            }
        },
        refreshTreeParam(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                treeParam: payload
            }
        },
    },
};

export default NoteModel;


