
/**
 * 提取文件夹数据(去掉叶子)
 * @param {*} nodes 
 * @returns 
 */
export function getFolderData(nodes) {
    return nodes.map(node => {
        let children;
        if (node.children) {
            const folders = [...node.children.filter(i => !i.isLeaf)]
            children = getFolderData(folders)
        }
        return { ...node, children }
    })
}

/**
 * 根据ID获取节点
 * @param {} id 
 * @param {*} nodes 
 * @returns 
 */
export function getNode(id, nodes) {
    if (id) {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.id == id) {
                return node;
            }
        }
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            const result = getNode(id, node.children)
            if (result) {
                return result;
            }
        }
    }
    return null;
}