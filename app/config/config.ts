// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import CompressionWebpackPlugin from 'compression-webpack-plugin';
import proxy from './proxy';
import menus from './menu';

const prodGzipList = ['js', 'css']

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: false,
  locale: {
    default: 'zh-CN',
    antd: false,
    baseNavigator: false,
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
          path: 'login',
          component: './user/login',
        },
        {
          name: 'freeLogin',
          path: 'freeLogin',
          component: './user/FreeLogin',
        },
      ],
    },
    {
      path: '/',
      redirect: menus.index,
    },
    ...menus.routes.map(r => ({
      ...r,
      layout: false,
      routes: r.routes.map(item => ({
        ...item, path: r.path + item.path
      }))
    })),
    {
      component: './404',
    },
  ],
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  define: {
    publicPath: REACT_APP_ENV == "dev" ? "http://localhost:89" : "http://42.192.15.59"
  },
  chainWebpack: config => {
    config.plugin('compression-webpack-plugin').use(
      new CompressionWebpackPlugin({
        algorithm: 'gzip',//指定生成gzip格式
        test: new RegExp('\\.(' + prodGzipList.join('|') + ')$'),//匹配哪些格式文件需要压缩
        threshold: 10240,//对超过10K的数据进行压缩
        minRatio: 0.6//压缩比例，值为0 ~ 1
      })
    )
  }
});
