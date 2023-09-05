import request from '@/utils/request';

export async function getSysData(code:string) {
  return request('/api/sys/data?code='+code);
}



export async function updateSysData(params: API.SysData) {
    return request('/api/sys/data', {
        method: 'PUT',
        data: {
            ...params,
            method: 'put',
        },
    });
}