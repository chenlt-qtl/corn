import { Reducer } from 'umi';
import { queryNote, queryTreeList } from '@/pages/note/service'
import { NoteNode } from '@/pages/note/data.d';

export interface NoteState {
    topMenuItem: Object[],
    menu1Item: Object[],
    menu2Item: Object[],
    menu3Item: Object[],
    activeTopId: string,
    activeMenu1Id: string,
    activeMenu2Id: string,
    activeMenu3Id: string,
    title1: string,
    title2: string,
    title3: string,
    treeData: NoteNode[];

}

export interface NoteModelType {
    namespace: 'noteMenu';
    state: NoteState;
    effects: {
        queryTopMenu: Effect;
        updateActiveTop: Effect;
        updateMenu1: Effect;
        queryMenuTree: Effect;
    }
    reducers: {
        refreshTopMenu: Reducer<NoteState>;
        refreshMenu1: Reducer<NoteState>;
        refreshMenu2: Reducer<NoteState>;
        refreshMenu3: Reducer<NoteState>;
        refreshActiveTopId: Reducer<NoteState>;
        refreshActiveMenu1Id: Reducer<NoteState>;
        refreshActiveMenu2Id: Reducer<NoteState>;
        refreshActiveMenu3Id: Reducer<NoteState>;
        refreshTitle2: Reducer<NoteState>;
        refreshTitle3: Reducer<NoteState>;
        refreshTreeData: Reducer<NoteState>;
    };
}

const NoteModel: NoteModelType = {
    namespace: 'noteMenu',
    state: {
        topMenuItem: [],
        menu1Item: [],
        menu2Item: [],
        menu3Item: [],
        activeTopId: '',
        activeMenu1Id: '',
        activeMenu2Id: '',
        activeMenu3Id: '',
        title1: '',
        title2: '',
        title3: '',
        treeData: [],
    },

    effects: {
        *queryTopMenu(_, { call, put }) {
            let result = yield call(queryNote, '0');
            if (result && result.success) {
                const topMenu = result.result;
                yield put({
                    type: 'refreshTopMenu',
                    payload: topMenu,
                })
                if (topMenu.length > 0) {
                    yield put({
                        type: 'refreshActiveTopId',
                        payload: topMenu[0].id,
                    })
                }
            }
        },
        *queryMenuTree({ payload }, { call, put }) {
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
        *updateActiveTop({ payload }, { call, put }) {
            yield put({
                type: 'updateMenu1',
                payload: payload,
            })
            yield put({
                type: 'refreshActiveTopId',
                payload: payload,
            })
        },
        *updateMenu1({ payload }, { call, put }) {
            let result = yield call(queryNote, payload);
            if (result) {
                if (result.success) {
                    yield put({
                        type: 'refreshMenu1',
                        payload: result.result,
                    })
                }
            }
        },
    },
    reducers: {
        refreshTopMenu(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                topMenuItem: payload,
            }
        },
        refreshMenu1(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                menu1Item: payload,
            }
        },
        refreshMenu2(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                menu2Item: payload,
            }
        },
        refreshMenu3(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                menu3Item: payload,
            }
        },
        refreshActiveTopId(state: NoteState, { payload }): NoteState {
            const { topMenuItem } = state;
            const activeTopMenu = topMenuItem.filter(item => item.id == payload);
            const title1 = activeTopMenu.length > 0 ? activeTopMenu[0].name : '';

            return {
                ...state,
                activeTopId: payload,
                activeMenu1Id: '',
                activeMenu2Id: '',
                activeMenu3Id: '',
                title1
            }
        },
        refreshActiveMenu1Id(state: NoteState, { payload }): NoteState {
            const { menu1Item } = state;
            const note = menu1Item.filter(item => item.id == payload);
            const title2 = note.length > 0 ? note[0].name : '';

            return {
                ...state,
                activeMenu1Id: payload,
                title2,
                activeMenu2Id: '',
                activeMenu3Id: '',
            }
        },
        refreshActiveMenu2Id(state: NoteState, { payload }): NoteState {
            const { menu2Item } = state;
            const note = menu2Item.filter(item => item.id == payload);
            const title3 = note.length > 0 ? note[0].name : '';
            return {
                ...state,
                activeMenu2Id: payload,
                activeMenu3Id: '',
                title3,
            }
        },
        refreshActiveMenu3Id(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                activeMenu3Id: payload,
            }
        },
        refreshTitle2(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                title2: payload,
            }
        },
        refreshTitle3(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                title3: payload,
            }
        },
        refreshTreeData(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                treeData: payload.data,
            }
        },
    },
};

export default NoteModel;