import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/sys/user/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
