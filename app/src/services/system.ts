import request from '@/utils/request';

export async function get(code:string) {
  return request('/api/sys/data?code='+code);
}



export async function update(params: API.SysData) {
    return request('/api/sys/data', {
        method: 'PUT',
        data: {
            ...params,
            method: 'put',
        },
    });
}