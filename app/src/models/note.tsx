import { updateNoteTitle, queryNoteById, updateNoteText, updateParent, deleteNote, editOneFav, queryTreeMenu, addNote } from '@/services/note'
import { NoteItem, NoteNode } from '@/data/note';
import { Effect, Reducer } from 'umi';
import { getFolderData } from '@/pages/note/Menu/utils';

export interface NoteState {
    openedNote: NoteItem;
    openedNotes: [];
    noteTreeData: NoteNode[];
    folderTreeData: NoteNode[];
    treeSelectKey: string;
    listParent: NoteItem;
}

export interface NoteModelType {
    namespace: 'note';
    state: NoteState;
    effects: {
        openNote: Effect;
        addNote: Effect;
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
        refreshTreeSelectKey: Reducer<NoteState>;
        refreshListParent: Reducer<NoteState>;
    };
}

const NoteModel: NoteModelType = {
    namespace: 'note',

    state: {
        openedNote: {},
        openedNotes: [],
        noteTreeData: [],
        treeSelectKey: "0",
        listParent: { id: "0" },
    },

    effects: {

        *openNote({ payload }, { call, put, select }) {

            const { openedNotes, listParent } = yield select(state => state.note);

            let note;

            let result = yield call(queryNoteById, payload);
            if (result) {
                if (result.success) {
                    note = result.result;
                    const notes = openedNotes.filter(i => i.id == payload)
                    if (notes.length == 0) {
                        yield put({
                            type: 'refreshOpenedNotes',
                            payload: [note, ...openedNotes],
                        })
                    }

                    yield put({
                        type: 'refreshOpenedNote',
                        payload: note,
                    })

                    yield put({
                        type: 'refreshTreeSelectKey',
                        payload: note.parentId || "0",
                    })

                    if (!isNaN(listParent.id) && listParent.id != note.parentId) {
                        yield put({
                            type: 'refreshListParent',
                            payload: { id: note.parentId },
                        })
                    }
                }
            }

        },
        * addNote({ payload }, { call, put, select }) {
            let result = yield call(addNote, payload);
            if (result && result.success) {
                yield put({ type: 'getNoteTree' })//刷新树
            }
            return result;
        },
        * updateNoteTitle({ payload }, { call, put, select }) {
            const openedNotes = yield select(state => state.note.openedNotes);

            let result = yield call(updateNoteTitle, payload);
            if (result && result.success) {
                yield put({ type: 'getNoteTree' })//刷新树
                //更新打开历史数据  
                const newOpenedNotes = [...openedNotes]
                const note = newOpenedNotes.filter(i => i.id == payload.id)
                if (note.length > 0) {
                    note[0].name = payload.name;
                    yield put({
                        type: "refreshOpenedNotes",
                        payload: newOpenedNotes
                    });
                }
                return result;
            }
        },
        * updateNoteText({ payload }, { call, put, select }) {
            let result = yield call(updateNoteText, payload);
            if (result && result.success) {

                //更新打开的数据  
                yield put({
                    type: "refreshOpenedNote",
                    payload: payload
                });

            }
            return result;
        },
        * deleteNote({ payload }, { call, put, select }) {
            const { openedNotes, openedNote } = yield select(state => state.note);

            let result = yield call(deleteNote, payload);
            if (result) {

                let newOpenedNotes = [...openedNotes].filter(i => i.id = payload);

                if (newOpenedNotes.length != openedNotes.length) {
                    yield put({
                        type: "refreshOpenedNotes",
                        payload: newOpenedNotes
                    });
                }

                if (openedNote && openedNote.id == payload) {
                    yield put({
                        type: "refreshOpenedNote", payload: {}
                    });
                }
                yield put({ type: 'getNoteTree' })//刷新树
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
                yield put({ type: 'getNoteTree' })//刷新树
            }
            return result;
        },
        * editFav({ payload }, { call, put, select }) {
            const listParent = yield select(state => state.note.listParent);
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


                        if (listParent.id == "fav") {
                            yield put({
                                type: "refreshListParent",
                                payload: { id: "fav" }
                            });
                        }
                    }
                }
                return result;
            }
        },
        *getNoteTree(_, { call, put }) {

            let res = yield call(queryTreeMenu, true);
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
                noteTreeData: payload,
                folderTreeData: getFolderData(payload)
            }
        },
        refreshTreeSelectKey(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                treeSelectKey: String(payload || "")
            }
        },
        refreshListParent(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                listParent: payload
            }
        },
    },
};

export default NoteModel;


