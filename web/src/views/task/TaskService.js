
import { httpAction } from '@/api/manage';

const url = {
    add: "/task/add",
    edit: "/task/edit",
}
export function updateTask(task, callback) {
    httpAction(url.edit, task, 'put').then((res) => {
        callback && callback(res);
    })
};
export function addTask(data, callback){
    httpAction(url.add, data, 'post').then((res) => {
        callback && callback(res);
    })
}