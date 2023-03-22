export function getFolderData(nodes) {
    return nodes.map(node => {
        let children;
        if (node.children) {
            children = [...node.children.filter(i => !i.isLeaf)]
            getFolderData(children)
        }
        return { ...node, children }
    })
}

export function getNode(id, nodes) {
    if (id) {
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.key == id) {
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