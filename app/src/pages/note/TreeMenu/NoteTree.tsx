import React, { useState, useEffect } from 'react';
import { Tree, Dropdown, Menu } from 'antd';
import { DeleteOutlined, EditOutlined, EllipsisOutlined, SwapOutlined } from '@ant-design/icons';
import styles from './style.less';
import { connect } from 'umi';
import { NoteNode } from '@/data/note'



const { DirectoryTree } = Tree;

function getNodes(id, nodes) {
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.key == id) {
            return node;
        }
    }
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const result = getNodes(id, node.children)
        if (result) {
            return result;
        }
    }
    return null;
}

const NoteTree: React.FC = (props, ref) => {

    const { treeData: allTreeData, onDelete, selectedKey, rootKey, setSelectedKey, setRootKey } = props;
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
    const [treeData, setTreeData] = useState<NoteNode[]>([])

    useEffect(() => {
        if (allTreeData && allTreeData.length > 0) {
            const node = getNodes(rootKey, allTreeData);
            setTreeData([node])
            setExpandedKeys([rootKey])
        }
    }, [rootKey, allTreeData]);

    useEffect(() => {
        const { listParam } = props.note;
        if (selectedKey != listParam.parentId) {
            props.dispatch({
                type: 'note/refreshListParam',
                payload: { ...props.note.listParam, parentId: selectedKey },
            })
        }
    }, [selectedKey]);

    useEffect(() => {
        const { openedNote } = props.note;

        if (openedNote.id) {
            const parent = getNodes(openedNote.parentId, treeData)
            onNodeSelect(null, parent)
        }

    }, [props.note.openedNote]);


    const handleExpand = (value) => {
        setExpandedKeys(value);
    }

    const getParentIds = (node, parentIds) => {
        if (node.parentId == rootKey) {
            return [...parentIds, rootKey]
        } else {
            const parent = getNodes(node.parentId, treeData)
            return getParentIds(parent, [...parentIds, parent.key]);
        }
    }

    const onNodeSelect = (e, node) => {
        e && e.stopPropagation();
        if (node.key != "0") {
            let newExpandedKeys;
            if (expandedKeys.includes(node.key)) {
                newExpandedKeys = expandedKeys.filter(i => i != node.key);
            } else {
                newExpandedKeys = [...getParentIds(node, []), node.key]
            }

            setExpandedKeys(newExpandedKeys)
        }
        setSelectedKey(node.key)
    }


    const operMenu = node => (
        <Menu>
            <Menu.Item onClick={e => props.handleRename(node)}>
                <EditOutlined />&nbsp;&nbsp;重命名
            </Menu.Item>
            <Menu.Item onClick={e => props.handleChangeParent(node)}>
                <SwapOutlined />&nbsp;&nbsp;移动
            </Menu.Item>
            <Menu.Item onClick={e => onDelete(node)}>
                <DeleteOutlined />&nbsp;&nbsp;删除
            </Menu.Item>
        </Menu>
    );


    const render = function () {
        return (
            <DirectoryTree
                selectedKeys={[selectedKey]}
                blockNode
                multiple
                showIcon={false}
                expandedKeys={expandedKeys}
                treeData={treeData}
                autoExpandParent={false}
                onExpand={handleExpand}
                titleRender={node => <div className={styles.treeNode} onClick={e => onNodeSelect(e, node)} onDoubleClick={() => setRootKey(node.key)}>
                    <div className={styles.title}>&nbsp;{node.title}</div>
                    {node.key == "0" ? "" : <div onClick={e => e.stopPropagation()}><Dropdown overlay={operMenu(node)} trigger={['click']}><div className="noteTreeMenu" ><EllipsisOutlined /></div></Dropdown></div>}
                </div>
                }
            />
        );
    };
    return render();
};

export default connect(({ note, loading }: { note: NoteModelState, loading }) => ({ note, loading }))(NoteTree);
