import { request } from 'umi';

export interface LoginParamsType {
  username: string;
  password: string;
  captcha: string;
}

export async function accountLogin(params: LoginParamsType) {
  return request<API.LoginStateType>('/api/sys/login', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  return request('/api/login/outLogin');
}
