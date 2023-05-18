import { encryption, decrypt } from '@/utils/utils';
import { StarOutlined, ClockCircleOutlined, FolderOutlined } from '@ant-design/icons';
import { history } from 'umi';
/**
 * 
 * @param note 加密
 * @returns 
 */
export const encryptionNote = note => {
    const result = { ...note };
    try {
        result.name = encryption(note.name);
        result.text = encryption(note.text);
    } catch (err) {
        console.log('加密失败', err)
    }
    return result;
}

/**
 * 
 * @param note 解密
 * @returns 
 */
export const decryptNote = note => {
    const result = { ...note };
    try {
        result.name = decrypt(note.name);
        result.text = decrypt(note.text);
    } catch (err) {
        console.log('解密失败', err)
    }
    return result;
}


export const menuData = [{ id: "fav", name: "收藏夹", icon: <StarOutlined /> },
{ id: "history", name: "最近打开", icon: <ClockCircleOutlined /> },
{ id: "0", name: "文件夹", icon: <FolderOutlined /> },
{ id: "search", name: "搜索结果", hide: true }]


export const getMenu = type => {
    const menu = menuData.filter(({ id }) => id == type)
    return menu[0]
}

export const isFolder = id => {
    if (isNaN(id)) {
        if (id == "search") {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}