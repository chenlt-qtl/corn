import React from 'react';
import { BasicLayoutProps, Settings as LayoutSettings } from '@ant-design/pro-layout';

import { notification } from 'antd';
import { history, RequestConfig } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { queryCurrent } from './services/user';
import tokenInterceptor from '@/utils/Interceptor';

import defaultSettings from '../config/defaultSettings';

export async function getInitialState(): Promise<{
  currentUser?: API.CurrentUser;
  settings?: LayoutSettings;
}> {
  // 如果是登录页面，不执行
  if (history.location.pathname !== '/user/login') {
    try {
      const currentUser = await queryCurrent();
      if (!currentUser) {
        history.push('/user/login');
      } else {
        return {
          currentUser,
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

export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings };
}): BasicLayoutProps => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};


interface error {
  name: string,
  data: {
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
