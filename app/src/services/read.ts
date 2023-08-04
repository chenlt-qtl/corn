import request from '@/utils/request';


export async function getArticle(params: number) {
    return request('/api/read/article/' + params);
}


export async function getMenu() {
    return request('/api/read/menu');
}
