
import { httpAction, getAction } from '@/api/manage';

const url = {
    add: "/task/add",
    edit: "/task/edit",
    list: "/task/list",
    typeList: "/taskType/list"
}

export const statusData = {
    1: { title: "进行中" },
    5: { title: "未开始" },
    9: { title: "已完成" },
    0: { title: "已删除" }
};

export function getColorByType(type, option) {
    let color = "#fff";
    if (type || type === 0) {
        option.forEach((option) => {
            if (option.id == type) {
                color = option.color;
            }
        });
    }
    return color;
}

export function updateTask(task, callback) {
    httpAction(url.edit, task, 'put').then((res) => {
        callback && callback(res);
    })
};
export function addTask(data, callback) {
    httpAction(url.add, data, 'post').then((res) => {
        callback && callback(res);
    })
}

export function getTaskData(searchParam, selectId, callback) {//获取任务数据
    let result = {};
    getAction(url.list, searchParam).then((res) => {
        if (res.success) {
            let tableData = [];
            res.result.records.forEach((task) => {
                task.edit = false;
                tableData.push(task);
                if (selectId && task.id == selectId) {
                    result.selectRow = task;
                }
            });
            result.total = res.result.total;
            result.tableData = tableData;
            if (!selectId && res.result.records.length > 0) {
                result.selectRow = res.result.records[0];
            }
            callback && callback(result);
        }
    })
}

export function getTypeData(callback) {//获取类型数据
    getAction(url.typeList, {}).then((res) => {
        if (res.success) {
            callback && callback([...res.result.records]);
        } else {
            callback && callback();
        }
    })
}