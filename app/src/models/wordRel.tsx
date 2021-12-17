// import { removeArticle, addWordUserRel, removeWordUserRel, addArticleWordRel, removeArticleWordRel } from '@/pages/word/service'
// import { Effect } from 'umi';


// export interface WordModelType {
//     namespace: 'wordRel';
//     effects: {
//         removeArticle: Effect;
//         addWordUserRel: Effect;
//         removeWordUserRel: Effect;
//         addArticleWordRel: Effect;
//         removeArticleWordRel: Effect;

//     };
// }

// const WordModel: WordModelType = {
//     namespace: 'wordRel',

//     effects: {
//         *removeArticle({ payload }, { call }) {
//             let result = yield call(removeArticle, payload);
//             if (result) {
//                 return result;
//             }

//         },
//         *addWordUserRel({ payload }, { call, put }) {
//             let result = yield call(addWordUserRel, payload.wordId);
//             if (result) {
//                 if (result) {
//                     yield put({
//                         type: 'getWordByArticle',
//                         payload: payload.articleId,
//                     });
//                     return result;
//                 }
//             }
//         },
//         *removeWordUserRel({ payload }, { call, put }) {
//             let result = yield call(removeWordUserRel, payload.wordId);
//             if (result) {
//                 if (result) {
//                     yield put({
//                         type: 'getWordByArticle',
//                         payload: payload.articleId,
//                     });
//                     return result;
//                 }
//             }
//         },
//         *addArticleWordRel({ payload }, { call, put }) {
//             let result = yield call(addArticleWordRel, payload);
//             if (result) {
//                 yield put({
//                     type: 'getWordByArticle',
//                     payload: payload.articleId,
//                 });
//                 return result;
//             }
//         },
//         *removeArticleWordRel({ payload }, { call, put }) {
//             let result = yield call(removeArticleWordRel, payload);
//             if (result) {
//                 yield put({
//                     type: 'getWordByArticle',
//                     payload: payload.articleId,
//                 });
//                 return result;
//             }
//         }

//     },

// };

// export default WordModel;