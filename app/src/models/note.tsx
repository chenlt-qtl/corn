import { updateNoteTitle,queryTreeList, queryNoteById, updateNoteText, queryNote, deleteNote } from '@/pages/note/service'
import { NoteItem, NoteNode } from '@/pages/note/data.d';
import { Effect, Reducer } from 'umi';


//根据ID查找节点
function findNodeById(tree: NoteNode[], id: string) {
    for (let item of tree) {
        if (item.key === id) {
            return item;
        }
        if (item.children && item.children.length > 0) {
            const node = findNodeById(item.children, id);
            if (node) {
                return node;
            }
        }
    }
}

export interface NoteState {
    activeTabId: string;
    activeNoteId: string;
    showNote: NoteItem;
    treeData: NoteNode[];
    selectedKeys: string[];
}

export interface NoteModelType {
    namespace: 'note';
    state: NoteState;
    effects: {
        queryTabTree: Effect;
        queryNote: Effect;
        queryChildren: Effect;
        updateNoteTitle: Effect;
        updateNoteText: Effect;
        deleteNote: Effect;
    };
    reducers: {
        refreshTreeData: Reducer<NoteState>;
        refreshActiveNoteId:Reducer<NoteState>;
        refreshShowNote: Reducer<NoteState>;
        refreshTreeNote: Reducer<NoteState>;
        refreshSelectedKeys: Reducer<NoteState>;
    };
}

const NoteModel: NoteModelType = {
    namespace: 'note',

    state: {
        activeTabId: '',
        activeNoteId:'',
        showNote: {},
        treeData: [],
        selectedKeys: [],
    },

    effects: {
        *queryTabTree({ payload }, { call, put }) {
            let result = yield call(queryTreeList, payload);
            if (result) {
                if (result.success) {
                    // 成功
                    yield put({
                        type: 'refreshTreeData',
                        payload: { data: result.result, activeTabId: payload }
                    });
                }
                return result;
            }
        },
        *queryNote({ payload }, { call, put, select }) {
            const openedNotes = yield select(state => state.openNotes.openedNotes);
            let note = openedNotes.find(item => {
                return item.id === payload;
            });
            if (note) {
                yield put({
                    type: 'refreshShowNote',
                    payload: note
                });
            } else {
                let result = yield call(queryNoteById, payload);
                if (result) {
                    if (result.success) {
                        note = result.result;
                        // 成功
                        yield put({
                            type: 'refreshShowNote',
                            payload: note
                        });
                        yield put({
                            type: 'openNotes/updateOpenNotes',
                            payload: [note, ...openedNotes]
                        });
                    }
                }
            }
            return note;
        },
        *queryChildren({ payload }, { call, put }) {
            let result = yield call(queryNote, payload);
            return result;
        },
        *updateNoteTitle({ payload }, { call }) {
            console.log('save');
            let result = yield call(updateNoteTitle, payload);
            if (result) {
                return result;
            }
        },
        *updateNoteText({ payload }, { call }) {
            console.log('save');
            let result = yield call(updateNoteText, payload);
            if (result) {
                return result;
            }
        },
        *deleteNote({ payload }, { call, put, select }) {
            let result = yield call(deleteNote, payload);
            if (result) {
                if (result.success) {
                    const activeTabId = yield select(state => state.note.activeTabId);
                    console.log(activeTabId);
                    // 成功
                    yield put({
                        type: 'queryTabTree',
                        payload: activeTabId
                    });
                    yield put({
                        type: 'refreshShowNote',
                        payload: {}
                    });
                }
            }
            return result;
        },
    },
    reducers: {
        refreshTreeData(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                activeTabId: payload.activeTabId,
                treeData: payload.data,
            }
        },
        refreshActiveNoteId(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                activeNoteId: payload,
            }
        },
        refreshShowNote(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                showNote: payload,
                selectedKeys: [payload.id],
                activeNoteId: payload.id,
            }
        },
        refreshTreeNote(state: NoteState, { payload }): NoteState {

            const treeData = [...state.treeData];
            const noteNode = findNodeById(treeData, payload.id);
            if (noteNode) {
                noteNode.title = payload.name;
                noteNode.name = payload.name;
            } else {
                const treeNode: NoteNode = {
                    key: payload.id,
                    parentIds: payload.parentIds,
                    title: payload.name,
                    name: payload.name,
                    parentId: payload.parentId,
                    children: []
                }
                if (payload.parentId === state.activeTabId) {
                    treeData.push(treeNode);
                } else {
                    const parent = findNodeById(treeData, payload.parentId);
                    if (parent) {
                        parent.children.push(treeNode);
                    }
                }
            }
            return {
                ...state,
                treeData,
            }
        },
        refreshSelectedKeys(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                selectedKeys: [...payload],
            }
        },
    },
};

export default NoteModel;