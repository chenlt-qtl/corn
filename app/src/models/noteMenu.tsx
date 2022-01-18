import { Reducer } from 'umi';
import { queryNote, queryTreeMenu, getNewest, searchNote } from '@/pages/note/service'
import { NoteNode, NoteItem } from '@/pages/note/data.d';

export interface NoteState {

    listMenuItems: Object[],
    listParentNote: NoteItem,
    treeData: NoteNode[];
    hasMore: boolean;
    pageNo: number;
    pageSize: number;
    activeMenuId: string;

}

export interface NoteModelType {
    namespace: 'noteMenu';
    state: NoteState;
    effects: {
        queryMenuItems: Effect;
        queryMenuTree: Effect;
        queryListParentNote: Effect;
        queryNewest: Effect;
        searchNote: Effect;
    }
    reducers: {
        refreshListMenu: Reducer<NoteState>;
        refreshListParentNote: Reducer<NoteState>;
        refreshTreeData: Reducer<NoteState>;
        refreshPageData: Reducer<NoteState>;
        refreshPageInfo: Reducer<NoteState>;
        refreshActiveMenuId: Reducer<NoteState>;
    };
}

const NoteModel: NoteModelType = {
    namespace: 'noteMenu',
    state: {
        listMenuItems: [],
        listParentNote: {},
        treeData: [],
        hasMore: true,
        pageNo: 0,
        pageSize: 20,
        activeMenuId: "",
    },

    effects: {
        *queryMenuTree({ payload }, { call, put }) {
            let result = yield call(queryTreeMenu, payload);
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

        *queryMenuItems({ payload }, { call, put }) {

            let result = yield call(queryNote, payload);
            if (result) {
                if (result.success) {
                    yield put({
                        type: 'refreshListMenu',
                        payload: result.result.sort((a, b) => a.isLeaf - b.isLeaf),
                    })
                }
            }
        },
        *queryNewest({ payload }, { call, put }) {
            
            let result = yield call(getNewest, payload.pageNo, payload.pageSize);

            if (result) {
                if (result.success) {
                    yield put({
                        type: 'refreshPageData',
                        payload: { ...payload, ...result },
                    })
                }
            }
        },
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
        *searchNote({ payload }, { call, put }) {

            let result = yield call(searchNote, payload);

            if (result) {
                yield put({
                    type: "refreshPageData",
                    payload: { ...result, ...payload }
                });
            }
        },
    },
    reducers: {
        refreshListMenu(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                listMenuItems: payload
            }
        },
        refreshListParentNote(state: NoteState, { payload }): NoteState {

            const note = payload || { id: 0, name: '所有笔记' };
            return {
                ...state,
                listParentNote: note,
            }
        },

        refreshTreeData(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                treeData: payload.data,
            }
        },
        refreshPageData(state: NoteState, { payload }): NoteState {
            const { result } = payload;
            const records = payload.result.records;
            const listMenuItems = payload.pageNo == 1 ? records : [...state.listMenuItems, ...records]

            return {
                ...state,
                hasMore: result["total"] - (state.pageNo + 1) * state.pageSize > 0,
                listMenuItems,
                pageNo: payload.pageNo,
                pageSize: payload.pageSize
            }
        },
        refreshPageInfo(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                pageNo: payload.pageNo,
                pageSize: payload.pageSize
            }
        },
        refreshActiveMenuId(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                activeMenuId: payload
            }
        },
    },
};

export default NoteModel;