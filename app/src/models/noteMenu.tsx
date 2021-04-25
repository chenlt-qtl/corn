import { Reducer } from 'umi';
import { queryTreeList, queryNoteById, modifyNote, addNote, queryNote, deleteNote } from '@/pages/note/service'


export interface NoteState {
    menu1Item: Object[],
    menu2Item: Object[],
    menu3Item: Object[],
    activeTopId: string,
    title1:string,

}

export interface NoteModelType {
    namespace: 'noteMenu';
    state: NoteState;
    effects: {
        updateActiveTop: Effect;
        updateMenu1:Effect;
    }
    reducers: {
        refreshMenu1: Reducer<NoteState>;
        refreshMenu2: Reducer<NoteState>;
        refreshMenu3: Reducer<NoteState>;
        refreshActiveTopId: Reducer<NoteState>;
        refreshTitle1: Reducer<NoteState>;

    };
}

const NoteModel: NoteModelType = {
    namespace: 'noteMenu',
    state: {
        menu1Item: [],
        menu2Item: [],
        menu3Item: [],
        activeTopId: '',
        title1:'',
    },

    effects: {
        *updateActiveTop({ payload }, { call, put }) {
            const {id,name} = payload;
            yield put({
                type: 'updateMenu1',
                payload: id,
            })
            yield put({
                type: 'refreshActiveTopId',
                payload: id,
            })
            yield put({
                type: 'refreshTitle1',
                payload: name,
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
        }
    },
    reducers: {
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
            return {
                ...state,
                activeTopId: payload,
            }
        },
        refreshTitle1(state: NoteState, { payload }): NoteState {
            return {
                ...state,
                title1: payload,
            }
        },
    },
};

export default NoteModel;