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
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
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
      path: '/',
      component: '@/layouts/GlobalHeader',
      layout:false,
      routes: [
        {
          path: '/note',
          name: 'note',
          component: './note',
        },
        {
          path: '/noteapp',
          name: 'noteapp',
          component: './note_app',
        },
        {
          path: '/article',
          name: 'articleList',
          component: './article/articleList',
        },
        {
          path: '/article/:id',
          name: 'articleDetail',
          layout: false,
          icon: 'smile',
          component: './article/ArticleDetail',
        },
        {
          path: '/splicMp3',
          name: 'splicMp3',
          layout: false,
          icon: 'smile',
          component: './article/splicMp3',
        },
        // {
        //   path: '/word/:wordName',
        //   name: 'wordDetail',
        //   layout: false,
        //   icon: 'smile',
        //   component: './article/WordDetail',
        // },
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
