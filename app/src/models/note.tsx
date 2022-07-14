import { updateNoteTitle, queryNoteById, updateNoteText, updateParent, deleteNote, editOneFav } from '@/services/note'
import { NoteItem } from '@/data/note';
import { Effect, Reducer } from 'umi';

export interface NoteState {
    openedNoteId: string;
    openedNotes: object;
    listParentNote: NoteItem,
    showMenu: boolean;
    favKey: number;//有变化刷新fav
    treeKey: number;//有变化刷新树
    listKey: number;//有变化刷新list
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
        updateParent: Effect;
        editFav: Effect;
    };
    reducers: {
        refreshOpenedNoteId: Reducer<NoteState>;
        refreshOpenedNotes: Reducer<NoteState>;
        refreshListParentNote: Reducer<NoteState>;
        refreshShowMenu: Reducer<NoteState>;
        refreshFavKey: Reducer<NoteState>;
        refreshTreeKey: Reducer<NoteState>;
        refreshListKey: Reducer<NoteState>;
    };
}

const NoteModel: NoteModelType = {
    namespace: 'note',

    state: {
        openedNoteId: "",
        openedNotes: {},
        listParentNote: {},
        showMenu: true,
        favKey: 1,
        treeKey: 1,
        listKey: 1,
    },

    effects: {

        *openNote({ payload }, { call, put, select }) {

            const openedNotes = yield select(state => state.note.openedNotes);

            const listParentNote = yield select(state => state.note.listParentNote);

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
            let parent = {};
            if (note.parentId != listParentNote.id) {

                if (note.parentId != "0") {
                    parent = yield call(queryNoteById, note.parentId);
                }

                yield put({
                    type: 'refreshListParentNote',
                    payload: parent.result,
                })
            }
            yield put({
                type: 'refreshOpenedNoteId',
                payload: payload,
            })
        },
        *closeNote({ payload }, { call, put, select }) {

            const openedNotes = yield select(state => state.note.openedNotes);
            const openedNoteId = yield select(state => state.note.openedNoteId);
            let notes = { ...openedNotes };
            delete notes[payload];

            yield put({
                type: 'refreshOpenedNotes',
                payload: notes
            })

            if (openedNoteId == payload) {//如果当前选中的笔记被关闭，修改选中的为下一个笔记
                yield put({
                    type: 'refreshOpenedNoteId',
                    payload: Object.keys(notes)[0],
                })
            }
        },
        *updateNoteTitle({ payload }, { call, put, select }) {
            const listParentNote = yield select(state => state.note.listParentNote);
            const openedNotes = yield select(state => state.note.openedNotes);

            let result = yield call(updateNoteTitle, payload);
            if (result) {

                const newData = result.result;

                //更新tab数据  
                if (newData.isLeaf) {//newData是文件才需要更新

                    if (openedNotes[payload.id]) {
                        yield put({
                            type: "refreshOpenedNotes",
                            payload: { ...openedNotes, [payload.id]: { ...openedNotes[payload.id], isNew: false, name: payload.name } }
                        });
                    }

                }

                //更新list菜单
                if (newData.id == listParentNote.id) {
                    yield put({
                        type: "refreshListParentNote",
                        payload: newData
                    });
                } else if (newData.parentId == listParentNote.id) {
                    yield put({
                        type: 'refreshListKey',
                    });
                }

                //更新tree菜单
                yield put({
                    type: 'refreshTreeKey',
                });

                return result;
            }
        },
        *updateNoteText({ payload }, { call, put, select }) {
            const openedNotes = yield select(state => state.note.openedNotes);
            const openedNoteId = yield select(state => state.note.openedNoteId);
            let result = yield call(updateNoteText, payload);
            if (result) {
                //更新tab数据
                if (openedNotes[payload.id]) {
                    yield put({
                        type: "refreshOpenedNotes",
                        payload: { ...openedNotes, [payload.id]: { ...openedNotes[payload.id], isNew: false, text: payload.text } }
                    });
                }

                return result;
            }
        },
        *deleteNote({ payload }, { call, put, select }) {
            const { id, parentId, isLeaf, parentIds } = payload;
            const openedNotes = yield select(state => state.note.openedNotes);
            const openedNoteId = yield select(state => state.note.openedNoteId);
            const listParentNote = yield select(state => state.note.listParentNote);
            let result = yield call(deleteNote, id);
            if (result) {

                let newOpenedNotes = {...openedNotes};
                if (isLeaf) {
                    delete newOpenedNotes[id];
                } else {
                    //文件夹
                    //刷新树
                    yield put({
                        type: 'refreshTreeKey',
                    });
                    //过滤tab
                    const reg = new RegExp("^" + parentIds + "/" + id)

                    newOpenedNotes = newOpenedNotes.filter(note => !reg.test(note.parentIds));
                    if (id == listParentNote.id) {//本人是list的根节点的话 跳到所有文件夹
                        yield put({
                            type: "refreshListParentNote",
                        });
                    }

                }

                if (parentId == listParentNote.id) {
                    yield put({
                        type: 'refreshListKey',
                    });
                }

                if (newOpenedNotes.length != openedNotes.length) {
                    yield put({
                        type: "refreshOpenedNotes",
                        payload: newOpenedNotes
                    });
                }

                if (openedNoteId == id) {
                    yield put({
                        type: "refreshOpenedNoteId",
                        payload: Object.keys(newOpenedNotes)[0]
                    });
                }

                return result;
            }
        },
        *updateParent({ payload }, { call, put, select }) {

            const { id, parentId } = payload;

            const openedNotes = yield select(state => state.note.openedNotes);

            const listParentNote = yield select(state => state.note.listParentNote);


            let result = yield call(updateParent, id, parentId);
            if (result) {
                const note = result.result;
                //更新树
                yield put({
                    type: 'refreshTreeKey',
                });

                if (openedNotes[id]) {
                    yield put({
                        type: "refreshOpenedNote",
                        payload: {...openedNotes,id:note}
                    });

                }

            }
            if (listParentNote.id == parentId) {
                yield put({
                    type: "refreshListParentNote",
                    payload: { ...listParentNote }
                });
            }
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
                            payload: {...openedNotes,[payload.noteId]:note}
                        })

                    }

                    //更新收藏夹
                    yield put({
                        type: 'refreshFavKey',
                    });

                }
                return result;
            }
        },
    },
    reducers: {
        refreshOpenedNoteId(state: NoteState, { payload }): NoteState {
            console.log(payload);

            return {
                ...state,
                openedNoteId: payload,
            }
        },
        refreshOpenedNotes(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                openedNotes: payload
            }
        },
        refreshListParentNote(state: NoteState, { payload }): NoteState {

            const note = payload || { id: 0, name: '所有笔记' };
            return {
                ...state,
                listParentNote: note,
            }
        },
        refreshShowMenu(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                showMenu: payload
            }
        },
        refreshFavKey(state: NoteState, _): NoteState {
            return {
                ...state,
                favKey: state.favKey + 1
            }
        },
        refreshTreeKey(state: NoteState, _): NoteState {
            return {
                ...state,
                treeKey: state.treeKey + 1
            }
        },
        refreshListKey(state: NoteState, _): NoteState {
            return {
                ...state,
                listKey: state.listKey + 1
            }
        },
    },
};

export default NoteModel;


