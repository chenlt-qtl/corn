import { updateNoteTitle, queryNoteById, updateNoteText, updateParent, deleteNote } from '@/pages/note/service'
import { NoteItem } from '@/pages/note/data.d';
import { Effect, Reducer } from 'umi';
import { isNormalNoteId } from '@/utils/utils';

export interface NoteState {
    openedNote: NoteItem;
    openedNotes: NoteItem[];
    showMenu: boolean;
}

export interface NoteModelType {
    namespace: 'note';
    state: NoteState;
    effects: {
        openNote: Effect;
        closeNote: Effect;
        updateNoteTitle: Effect;
        updateNoteText: Effect;
        deleteNote: Effect;
        updateFav: Effect;
        updateParent: Effect;
    };
    reducers: {
        refreshOpenedNote: Reducer<NoteState>;
        refreshOpenedNotes: Reducer<NoteState>;
        refreshShowMenu: Reducer<NoteState>;
    };
}

const NoteModel: NoteModelType = {
    namespace: 'note',

    state: {
        openedNote: {},
        openedNotes: [],
        showMenu: true,
    },

    effects: {

        *openNote({ payload }, { call, put, select }) {

            const openedNotes = yield select(state => state.note.openedNotes);

            const listParentNote = yield select(state => state.noteMenu.listParentNote);

            let note = openedNotes.find(item => {
                return item.id === payload;
            });

            if (!note) {
                let result = yield call(queryNoteById, payload);
                if (result) {
                    if (result.success) {
                        note = result.result;

                        // 成功
                        yield put({
                            type: 'refreshOpenedNotes',
                            payload: [note, ...openedNotes]
                        })

                    }
                }
            }

            if (note.parentId != listParentNote.id && isNormalNoteId(listParentNote.id)) {
                let parent = yield call(queryNoteById, note.parentId);

                if (parent) {
                    yield put({
                        type: 'noteMenu/refreshListParentNote',
                        payload: parent.result,
                    })
                }
            }

            yield put({
                type: 'refreshOpenedNote',
                payload: note,
            })
        },
        *closeNote({ payload }, { call, put, select }) {

            const openedNotes = yield select(state => state.note.openedNotes);
            const openedNote = yield select(state => state.note.openedNote);
            let notes = openedNotes.filter(note => note.id !== payload);

            yield put({
                type: 'refreshOpenedNotes',
                payload: [...notes]
            })

            if (openedNote.id == payload) {
                yield put({
                    type: 'refreshOpenedNote',
                    payload: notes[0] || {},
                })
            }
        },
        *updateNoteTitle({ payload }, { call, put, select }) {
            const listParentNote = yield select(state => state.noteMenu.listParentNote);
            const openedNotes = yield select(state => state.note.openedNotes);
            const openedNote = yield select(state => state.note.openedNote);

            let result = yield call(updateNoteTitle, payload);
            if (result) {

                const newData = result.result;

                //更新tab数据  
                if (newData.isLeaf) {//newData是文件才需要更新
                    yield put({
                        type: "refreshOpenedNotes",
                        payload: openedNotes.map(item => {
                            if (item.id == "new" && !payload.id) {
                                return newData;
                            }
                            if (item.id == payload.id) {
                                item.name = payload.name
                            }
                            return item;
                        }
                        )
                    });


                    //更新已打开
                    if (openedNote.id == "new") {
                        yield put({
                            type: "refreshOpenedNote",
                            payload: newData
                        })
                    }
                }

                //更新list菜单
                if (newData.id == listParentNote.id) {
                    yield put({
                        type: "noteMenu/refreshListParentNote",
                        payload: newData
                    });
                } else if (newData.parentId == listParentNote.id) {
                    yield put({
                        type: "noteMenu/queryMenuItems",
                        payload: listParentNote.id
                    });
                }

                //更新tree菜单
                yield put({
                    type: `noteMenu/queryMenuTree`,
                    payload: 0,
                })

                return result;
            }
        },
        *updateNoteText({ payload }, { call, put, select }) {
            const openedNotes = yield select(state => state.note.openedNotes);
            let result = yield call(updateNoteText, payload);
            if (result) {
                //更新tab数据
                yield put({
                    type: "refreshOpenedNotes",
                    payload: openedNotes.map(item => {
                        if (item.id == payload.id) {
                            item.text = payload.text
                        }
                        return item;
                    }
                    )
                });
                return result;
            }
        },
        *deleteNote({ payload }, { call, put, select }) {
            const { id, parentId, isLeaf, parentIds } = payload;
            const openedNotes = yield select(state => state.note.openedNotes);
            const openedNote = yield select(state => state.note.openedNote);
            const listParentNote = yield select(state => state.noteMenu.listParentNote);
            let result = yield call(deleteNote, id);
            if (result) {

                let newOpenedNotes = [...openedNotes];
                if (isLeaf) {
                    newOpenedNotes = newOpenedNotes.filter(note => note.id != id);
                } else {
                    //文件夹
                    //刷新树
                    yield put({
                        type: "noteMenu/queryMenuTree",
                        payload: 0
                    });

                    //过滤tab
                    const reg = new RegExp("^" + parentIds + "/" + id)

                    newOpenedNotes = newOpenedNotes.filter(note => !reg.test(note.parentIds));
                    if (id == listParentNote.id) {//本人是list的根节点的话 跳到所有文件夹
                        yield put({
                            type: "noteMenu/refreshListParentNote",
                        });
                    }

                }

                if (parentId == listParentNote.id) {

                    yield put({
                        type: "noteMenu/queryMenuItems",
                        payload: listParentNote.id
                    });
                }

                if (newOpenedNotes.length != openedNotes.length) {
                    yield put({
                        type: "refreshOpenedNotes",
                        payload: newOpenedNotes
                    });
                }

                if (openedNote.id == id) {
                    yield put({
                        type: "refreshOpenedNote",
                        payload: newOpenedNotes[0]
                    });
                }


                return result;
            }
        },
        *updateParent({ payload }, { call, put, select }) {
            const { id, parentId } = payload;
            const openedNotes = yield select(state => state.note.openedNotes);
            const openedNote = yield select(state => state.note.openedNote);

            const listParentNote = yield select(state => state.noteMenu.listParentNote);
            let result = yield call(updateParent, id, parentId);
            if (result) {
                const note = result.result;
                //文件夹
                if (!note.isLeaf) {
                    yield put({
                        type: "noteMenu/queryMenuTree",
                        payload: 0
                    });
                } else {//文件

                    if (openedNote.id == id) {
                        yield put({
                            type: "refreshOpenedNote",
                            payload: openedNote
                        });

                    }
                    yield put({
                        type: "refreshOpenedNotes",
                        payload: openedNotes.map(item => item.id == id ? { ...item, ...note } : item)
                    });

                }
                yield put({
                    type: "noteMenu/refreshListParentNote",
                    payload: { ...listParentNote }
                });
            }
        }
    },
    reducers: {
        refreshOpenedNote(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                openedNote: payload,
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

    },
};

export default NoteModel;


