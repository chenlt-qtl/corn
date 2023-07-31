import { Settings as LayoutSettings } from '@ant-design/pro-layout';

import { notification } from 'antd';
import { history, RequestConfig } from 'umi';
import { queryCurrent } from './services/user';
import tokenInterceptor from '@/utils/Interceptor';

import defaultSettings from '../config/defaultSettings';


const freePathReg = [/^\/all\/read/]

const isFreeUrl = (pathname="") => {
  if (pathname == '/user/login') {
    return true;
  } else {
    const path = freePathReg.find(reg => pathname.match(reg))
    return !!path;
    
  }
}


export async function getInitialState(): Promise<{
  currentUser?: API.CurrentUser;
  settings?: LayoutSettings;
}> {
  // 如果是不需要登录页面或者登录页面，不执行
  const { pathname } = history.location;
  if (!isFreeUrl(pathname)) {
    try {
      const res = await queryCurrent();
      if (!res.success) {
        history.push('/user/login');
      } else {
        return {
          currentUser: res["result"],
          settings: defaultSettings,
        };
      }
    } catch (error) {
      history.push('/user/login');
    }
  }
  return {
    settings: defaultSettings,
  };
}


interface error {
  name: string,
  data: {
    status: number,
    success: boolean,
    message: string,
    result: any,
    code: number,
  }

}
/**
 * 异常处理程序
 */
const errorHandler = (error: error) => {
  const { data } = error;
  if (data) {
    const errorText = data.message;
    notification.error({
      message: `请求错误`,
      description: errorText,
    });
    if (data.status === 500) {
      history.push('/user/login');
    }
  } else {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
};

export const request: RequestConfig = {
  errorHandler, credentials: 'include', requestInterceptors: [tokenInterceptor]
};
