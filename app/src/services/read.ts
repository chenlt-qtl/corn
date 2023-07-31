import request from '@/utils/request';


export async function getArticle(params: number) {
    return request('/api/read/article/' + params);
}
