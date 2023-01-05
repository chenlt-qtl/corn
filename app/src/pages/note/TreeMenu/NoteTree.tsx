import React, { useState, useEffect } from 'react';
import { Tree, Modal, notification, Dropdown, Menu } from 'antd';
import { DeleteOutlined, ExclamationCircleOutlined, EditOutlined, EllipsisOutlined, SwapOutlined } from '@ant-design/icons';
import styles from './style.less';
import { connect } from 'umi';
import { NoteNode } from '@/data/note'


const { confirm } = Modal;

const { DirectoryTree } = Tree;

function getNodes(pId, nodes) {
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.key == pId) {
            return node;
        }
    }
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const result = getNodes(pId, node.children)
        if (result) {
            return result;
        }
    }
    return null;
}

const NoteTree: React.FC = (props, ref) => {

    const { treeData: allTreeData } = props;

    const { selectedKey, rootKey, setSelectedKey, setRootKey } = props;
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
                payload: { parentId: selectedKey },
            })
        }
    }, [selectedKey]);

    useEffect(() => {
        const { openedNote } = props.note;

        if (openedNote && openedNote.parentIds) {
            const expandedKeys = (openedNote.parentIds || "").split("/")

            setExpandedKeys([openedNote.id, ...expandedKeys])
        }

        if (openedNote.parentId != selectedKey) {
            setSelectedKey(openedNote.parentId);
        }

    }, [props.note.openedNote]);


    const handleExpand = (value) => {
        setExpandedKeys(value);
    }


    const handleDelete = (node) => {
        confirm({
            title: `确定要删除 ${node.title}?`,
            icon: <ExclamationCircleOutlined />,
            onOk() {

                props.dispatch({
                    type: 'note/deleteNote',
                    payload: node.key,
                }).then(() => {
                    notification["info"]({
                        message: '删除成功',
                    });
                });
            }
        });
    }

    const onDrop: TreeProps['onDrop'] = ({ node, dragNode }) => {

        const newParentId = node.key;
        if (dragNode && dragNode.parentId != newParentId && dragNode.key != newParentId) {
            props.dispatch({
                type: 'note/updateParent',
                payload: { id: dragNode.key, parentId: newParentId },
            })
        }
    }

    const operMenu = node => (
        <Menu>
            <Menu.Item onClick={e => props.handleRename(node)}>
                <EditOutlined />&nbsp;&nbsp;重命名
            </Menu.Item>
            <Menu.Item onClick={e => props.handleChangeParent(node)}>
                <SwapOutlined />&nbsp;&nbsp;移动
            </Menu.Item>
            <Menu.Item onClick={e => handleDelete(node)}>
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
                draggable
                onDrop={onDrop}
                titleRender={node => <div className={styles.treeNode} onClick={e => {
                    e.stopPropagation();
                    setSelectedKey(node.key)
                }} onDoubleClick={() => setRootKey(node.key)}>
                    <div className={styles.title}>&nbsp;{node.title}</div>
                    {node.key == "0" ? "" : <Dropdown overlay={operMenu(node)} trigger={['click']}><div className="noteTreeMenu" ><EllipsisOutlined /></div></Dropdown>}
                </div>
                }
            />
        );
    };
    return render();
};

export default connect(({ note, loading }: { note: NoteModelState, loading }) => ({ note, loading }))(NoteTree);
