// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    name: 'Corn',
    locale: true,
    siderWidth: 208,
  },
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },

    {
      path: '/welcome',
      name: 'welcome',
      icon: 'smile',
      component: './Welcome',
    },
    {
      path: '/admin',
      name: 'admin',
      icon: 'crown',
      access: 'canAdmin',
      component: './Admin',
      routes: [
        {
          path: '/admin/sub-page',
          name: 'sub-page',
          icon: 'smile',
          component: './Welcome',
        },
      ],
    },
    {
      name: 'list.table-list',
      icon: 'table',
      path: '/list',
      component: './ListTableList',
    },
    {
      path: '/corn',
      name: 'corn',
      layout: false,
      icon: 'smile',
      component: './corn/Index',
    },
    {
      path: '/',
      redirect: '/noteapp',
    },
    {
      path: '/play/cn/:id',
      name: 'level',
      layout: false,
      component: './game/play/cnGame',
    },
    {
      path: '/',
      component: '@/layouts/GlobalHeader',
      layout: false,
      routes: [
        {
          path: '/noteapp',
          name: 'noteapp',
          component: './note',
        },
        {
          path: '/word',
          name: 'wordList',
          component: './word/articleList',
        },
        {
          path: '/word/:id',
          name: 'articleDetail',
          layout: false,
          icon: 'smile',
          component: './word/articleDetail',
        },
        {
          path: '/splicMp3',
          name: 'splicMp3',
          layout: false,
          icon: 'smile',
          component: './splicMp3',
        },
        {
          path: '/wordChinese',
          name: 'wordChineseList',
          component: './wordChinese/articleList',
        },
        {
          path: '/wordChinese/:id',
          name: '文章明细',
          layout: false,
          icon: 'smile',
          component: './wordChinese/articleDetail',
        },
        // {
        //   path: '/word/:wordName',
        //   name: 'wordDetail',
        //   layout: false,
        //   icon: 'smile',
        //   component: './article/WordDetail',
        // },
        {
          path: '/game',
          name: 'game',
          component: './game/gameList',
        },
        {
          path: '/play/list',
          name: 'playList',
          component: './game/play/list',
        }
        ,
        {
          path: '/play/:id',
          name: 'playLevels',
          component: './game/play/levelList',
        }
        ,
        {
          path: '/exam',
          name: 'exam',
          component: './exam',
        }
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
