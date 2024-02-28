import request from '@/utils/request';
import { encryption } from '@/utils/utils'

export interface LoginParamsType {
  username: string;
  password: string;
  captcha: string;
}

export async function accountLogin(params: LoginParamsType) {

  return request('/api/sys/login', {
    method: 'POST',
    data: {
      username: encryption(params.username),
      password: encryption(params.password),
      captcha: params.captcha
    }
  });
}

export async function freeLogin(password:string) {
  return request('/api/sys/freeLogin', {
    method: 'POST',
    data: {
      password: encryption(password)    }
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  return request('/api/sys/logout');
}
