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
    result.name = encryption(note.name);
    result.text = encryption(note.text);
    result.parents = encryption(note.parents);
    return result;
}

/**
 * 
 * @param note 解密
 * @returns 
 */
export const decryptNote = note => {
    const result = { ...note };
    result.name = decrypt(note.name);
    result.text = decrypt(note.text);
    result.parents = decrypt(note.parents);
    return result;
}

export const changeUrl = (props, name, value, newQuery = {}) => {

    const { location = {}, match = { params: {} } } = props;
    const { type, id } = match.params;
    const query = { ...(location.query || {}), ...newQuery }

    let url = "/page/note";
    if (name == "type") {
        query.type = value
    } else {
        url += "/" + value;
    }

    history.push({
        pathname: url,
        query
    })

}


export const menuData = [{ id: "fav", name: "收藏夹", icon: <StarOutlined /> }, { id: "history", name: "最近打开", icon: <ClockCircleOutlined /> }, { id: "folder", name: "文件夹", icon: <FolderOutlined /> }]


export const getMenu = type => {
    const menu = menuData.filter(({ id }) => id == type)
    return menu[0]
}